package com.haocp.auth_service.configurations;

import com.haocp.auth_service.dtos.requests.VerifyTokenRequest;
import com.haocp.auth_service.exceptions.AppException;
import com.haocp.auth_service.exceptions.ErrorCode;
import com.haocp.auth_service.services.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;

import javax.crypto.spec.SecretKeySpec;
import java.util.Objects;

@Configuration
public class JwtDecoderConfig implements JwtDecoder {

    @Autowired
    private AuthService authService;

    private NimbusJwtDecoder jwtDecoder = null;

    @Value("${jwt.signer-key}")
    private String signerKey;

    @Override
    public Jwt decode(String token) throws JwtException {
        var response = authService.introspect(VerifyTokenRequest.builder()
                .token(token)
                .build());
        if (!response)
            throw new AppException(ErrorCode.INVALID_TOKEN);
        if (Objects.isNull(jwtDecoder)){
            SecretKeySpec key = new SecretKeySpec(signerKey.getBytes(), "HS512");
            jwtDecoder = NimbusJwtDecoder
                    .withSecretKey(key)
                    .macAlgorithm(MacAlgorithm.HS512)
                    .build();
        }
        return jwtDecoder.decode(token);
    }

}
