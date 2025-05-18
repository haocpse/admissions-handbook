package com.haocp.auth_service.services;

import com.haocp.auth_service.dtos.requests.CreateUserRequest;
import com.haocp.auth_service.dtos.requests.VerifyTokenRequest;
import com.haocp.auth_service.dtos.requests.LoginRequest;
import com.haocp.auth_service.dtos.responses.LoginResponse;
import com.haocp.auth_service.dtos.responses.UserResponse;
import com.haocp.auth_service.entities.InvalidToken;
import com.haocp.auth_service.entities.Role;
import com.haocp.auth_service.entities.User;
import com.haocp.auth_service.exceptions.AppException;
import com.haocp.auth_service.exceptions.ErrorCode;
import com.haocp.auth_service.mapper.UserMapper;
import com.haocp.auth_service.repositories.AuthRepository;
import com.haocp.auth_service.repositories.InvalidTokenRepository;
import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.text.ParseException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.StringJoiner;
import java.util.UUID;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AuthService {
    @Autowired
    AuthRepository authRepository;
    @Autowired
    UserMapper userMapper;
    @Autowired
    PasswordEncoder passwordEncoder;
    @Value("${jwt.signer-key}") @NonFinal
    String signerKey;
    @Value("${jwt.valid-duration}") @NonFinal
    int validDuration;
    @Value("${jwt.refreshable-duration}") @NonFinal
    int refreshDuration;
    @Autowired
    InvalidTokenRepository invalidTokenRepository;

    public UserResponse register(CreateUserRequest request) {
        User user = User.builder()
                .email(request.getEmail())
                .username(request.getEmail())
                .role(Role.USER)
                .firstName("")
                .lastName("")
                .build();
        return userMapper.toUserResponse(authRepository.save(user));
    }

    public LoginResponse login(LoginRequest request) {
        User user = authRepository.findByUsernameAndActive(request.getUsername(), true)
                .orElseThrow(()-> new AppException(ErrorCode.NOT_FOUND_USER));
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword()) ) {
           throw new AppException(ErrorCode.WRONG_PASSWORD); // custom loi o day
        }
        return LoginResponse.builder()
                .accessToken(generateToken(user))
                .build();
    }

    public boolean introspect(VerifyTokenRequest request) {
        try {
            verifyToken(request.getToken(), false);
        } catch (ParseException | JOSEException e) {
            return false;
        }
        return true;
    }

    public void logout(VerifyTokenRequest request) {
        try {
            SignedJWT signedJWT = verifyToken(request.getToken(), true);
            String jit = signedJWT.getJWTClaimsSet().getJWTID();
            Date expiryDate = signedJWT.getJWTClaimsSet().getExpirationTime();
            invalidTokenRepository.save(InvalidToken.builder()
                    .id(jit)
                    .expiryTime(expiryDate)
                    .build());
        } catch (ParseException | JOSEException e) {
            throw new RuntimeException(e);
        }
    }

    public LoginResponse refreshToken(VerifyTokenRequest request) {
        try {
            SignedJWT signedJWT = verifyToken(request.getToken(), true);
            String username = signedJWT.getJWTClaimsSet().getSubject();
            User user = authRepository.findByUsernameAndActive(username, true)
                    .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND_USER));
            return LoginResponse.builder()
                    .accessToken(generateToken(user))
                    .build();
        } catch (ParseException | JOSEException e) {
            throw new AppException(ErrorCode.INVALID_TOKEN); // custom lỗi nếu cần
        }
    }

    String generateToken(User user){
        JWSHeader header = new JWSHeader(JWSAlgorithm.HS512);
        JWTClaimsSet jwtClaimsSet = new JWTClaimsSet.Builder()
                .subject(user.getUsername())
                .issuer("haocp")
                .issueTime(new Date())
                .expirationTime(new Date(Instant.now().plus(validDuration, ChronoUnit.SECONDS).toEpochMilli()))
                .jwtID(UUID.randomUUID().toString())
                .claim("scope", buildScope(user.getRole()))
                .build();
        Payload payload = new Payload(jwtClaimsSet.toJSONObject());
        JWSObject jwtObject = new JWSObject(header, payload);
        try {
            jwtObject.sign(new MACSigner(signerKey.getBytes()));
            return jwtObject.serialize();
        } catch (JOSEException e) {
            throw new RuntimeException(e);
        }
    }

    String buildScope(Role role) {
        StringJoiner joiner = new StringJoiner(" ");
        return joiner.add(role.name()).toString();
    }

    SignedJWT verifyToken(String token, boolean isRefresh) throws ParseException, JOSEException {
        JWSVerifier verifier = new MACVerifier(signerKey.getBytes());
        SignedJWT signedJWT = SignedJWT.parse(token);
        Date expiryTime = (isRefresh)
                ? new Date(signedJWT.getJWTClaimsSet().getIssueTime().toInstant().plus(refreshDuration, ChronoUnit.SECONDS).toEpochMilli())
                : signedJWT.getJWTClaimsSet().getExpirationTime();
        var verified = signedJWT.verify(verifier);
        if (!verified && expiryTime.after(new Date()))
            throw new AppException(ErrorCode.INVALID_TOKEN);
        if (invalidTokenRepository.existsById(signedJWT.getJWTClaimsSet().getJWTID()))
            throw new AppException(ErrorCode.INVALID_TOKEN);
        return signedJWT;
    }

}
