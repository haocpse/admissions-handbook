package com.haocp.auth_service.services;

import com.haocp.auth_service.dtos.requests.CreateUserRequest;
import com.haocp.auth_service.dtos.requests.GmailLoginRequest;
import com.haocp.auth_service.dtos.requests.VerifyTokenRequest;
import com.haocp.auth_service.dtos.requests.LoginRequest;
import com.haocp.auth_service.dtos.responses.IntrospectResponse;
import com.haocp.auth_service.dtos.responses.LoginResponse;
import com.haocp.auth_service.dtos.responses.UserResponse;
import com.haocp.auth_service.entities.InvalidToken;
import com.haocp.auth_service.entities.Role;
import com.haocp.auth_service.entities.User;
import com.haocp.auth_service.exceptions.AppException;
import com.haocp.auth_service.exceptions.ErrorCode;
import com.haocp.auth_service.mapper.UserMapper;
import com.haocp.auth_service.repositories.UserRepository;
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
import java.util.UUID;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AuthServiceImpl implements AuthService {
    @Autowired
    UserRepository userRepository;
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
    @Autowired
    UserMapper userMapper;

    public UserResponse register(CreateUserRequest request) {
        User user = User.builder()
                .email(request.getEmail())
                .username(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.USER)
                .updatedAt(new Date())
                .createdAt(new Date())
                .firstName("")
                .active(true)
                .lastName("")
                .build();
        UserResponse response = userMapper.toUserResponse(userRepository.save(user));
        response.setFullName(user.getFirstName() + " " + user.getLastName() );
        return response;
    }

    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByUsernameAndActive(request.getUsername(), true)
                .orElseThrow(()-> new AppException(ErrorCode.NOT_FOUND_USER));
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword()) ) {
           throw new AppException(ErrorCode.WRONG_PASSWORD); // custom loi o day
        }
        return LoginResponse.builder()
                .accessToken(generateToken(user))
                .build();
    }

    public IntrospectResponse introspect(VerifyTokenRequest request) {
        try {
            SignedJWT jwt = verifyToken(request.getToken(), false);
            return IntrospectResponse.builder()
                    .valid(true)
                    .username(jwt.getJWTClaimsSet().getSubject())
                    .build();
        } catch (ParseException | JOSEException e) {
            throw new AppException(ErrorCode.INVALID_TOKEN);
        }
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
            User user = userRepository.findByUsernameAndActive(username, true)
                    .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND_USER));
            return LoginResponse.builder()
                    .accessToken(generateToken(user))
                    .build();
        } catch (ParseException | JOSEException e) {
            throw new AppException(ErrorCode.INVALID_TOKEN);
        }
    }

    public LoginResponse gmailLogin(GmailLoginRequest request) {
        String email = request.getEmail();
        String username = request.getName();
        User user = userRepository.findByUsernameAndActive(email, true)
                .orElseGet(() -> {
                    User newUser = User.builder()
                            .email(request.getEmail())
                            .username(request.getEmail())
                            .password(passwordEncoder.encode("123"))
                            .role(Role.USER)
                            .updatedAt(new Date())
                            .createdAt(new Date())
                            .firstName(username)
                            .active(true)
                            .lastName("")
                            .build();
                    return userRepository.save(newUser);
                });
        return LoginResponse.builder()
                .accessToken(generateToken(user))
                .build();
    }

    String generateToken(User user){
        JWSHeader header = new JWSHeader(JWSAlgorithm.HS512);
        JWTClaimsSet jwtClaimsSet = new JWTClaimsSet.Builder()
                .subject(user.getUsername())
                .issuer("haocp")
                .issueTime(new Date())
                .expirationTime(new Date(Instant.now().plus(validDuration, ChronoUnit.SECONDS).toEpochMilli()))
                .jwtID(UUID.randomUUID().toString())
                .claim("scope", user.getRole().toString())
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
