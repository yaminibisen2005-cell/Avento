package com.avento.config;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import javax.sql.DataSource;
import java.net.URI;

@Configuration
public class DataSourceConfig {

    private static final Logger logger = LoggerFactory.getLogger(DataSourceConfig.class);

    @Value("${spring.datasource.url}")
    private String rawUrl;

    @Value("${spring.datasource.username:}")
    private String username;

    @Value("${spring.datasource.password:}")
    private String password;

    @Value("${spring.datasource.driver-class-name:com.mysql.cj.jdbc.Driver}")
    private String driverClassName;

    @Bean
    @Primary
    public DataSource dataSource() {
        HikariConfig config = new HikariConfig();

        String cleanUrl = rawUrl != null ? rawUrl.trim() : "";
        String parsedUsername = (username != null && !username.isBlank()) ? username.trim() : "";
        String parsedPassword = (password != null && !password.isBlank()) ? password.trim() : "";

        // Auto-handle cloud URI formats like mysql://user:password@host:port/dbname?ssl-mode=REQUIRED (Aiven, Render, Heroku)
        if (cleanUrl.startsWith("mysql://")) {
            try {
                URI uri = URI.create(cleanUrl);
                String userInfo = uri.getUserInfo();
                if (userInfo != null && userInfo.contains(":")) {
                    String[] parts = userInfo.split(":", 2);
                    if (parsedUsername.isEmpty() || "root".equals(parsedUsername)) {
                        parsedUsername = parts[0];
                    }
                    if (parsedPassword.isEmpty() || "Nitin@2004".equals(parsedPassword)) {
                        parsedPassword = parts[1];
                    }
                }

                int port = uri.getPort() != -1 ? uri.getPort() : 3306;
                String path = uri.getPath() != null ? uri.getPath() : "/defaultdb";
                String query = uri.getQuery();

                // MySQL Connector/J uses sslMode rather than ssl-mode
                if (query != null) {
                    query = query.replace("ssl-mode=", "sslMode=");
                    if (!query.contains("allowPublicKeyRetrieval")) {
                        query += "&allowPublicKeyRetrieval=true";
                    }
                } else {
                    query = "sslMode=REQUIRED&allowPublicKeyRetrieval=true";
                }

                cleanUrl = "jdbc:mysql://" + uri.getHost() + ":" + port + path + "?" + query;
                logger.info("Auto-adapted cloud MySQL URI to JDBC format for host: {}:{}", uri.getHost(), port);
            } catch (Exception ex) {
                logger.warn("Could not parse cloud URI, prepending jdbc: prefix directly: {}", ex.getMessage());
                cleanUrl = "jdbc:" + cleanUrl;
            }
        } else if (!cleanUrl.startsWith("jdbc:")) {
            cleanUrl = "jdbc:" + cleanUrl;
        }

        config.setJdbcUrl(cleanUrl);
        config.setUsername(parsedUsername);
        config.setPassword(parsedPassword);
        config.setDriverClassName(driverClassName);

        // Connection pool tuning for cloud databases (Aiven, AWS RDS, Render)
        config.setMaximumPoolSize(10);
        config.setMinimumIdle(2);
        config.setConnectionTimeout(30000);
        config.setIdleTimeout(600000);
        config.setMaxLifetime(1800000);

        return new HikariDataSource(config);
    }
}
