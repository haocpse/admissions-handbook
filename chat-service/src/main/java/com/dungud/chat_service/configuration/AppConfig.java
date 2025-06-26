package com.dungud.chat_service.configuration;

import org.springframework.cloud.client.loadbalancer.LoadBalanced;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

@Configuration
public class AppConfig {
    // Dành cho service nội bộ
    @Bean
    @LoadBalanced
    public RestTemplate loadBalancedRestTemplate() {
        return new RestTemplate();
    }

    // Dành cho gọi API bên ngoài như Gemini
    @Bean
    public RestTemplate externalRestTemplate() {
        return new RestTemplate();
    }
}
