package com.ly.springbootdemo20190411;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.context.annotation.ImportResource;

/**
 * @author Administrator
 */
@SpringBootApplication(exclude={DataSourceAutoConfiguration.class})
public class Springbootdemo20190411Application {

	public static void main(String[] args) {
		SpringApplication.run(Springbootdemo20190411Application.class, args);
	}

}
