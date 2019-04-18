package com.ly.springbootdemo20190411.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author xinre
 * @date 2019/4/11 13:36
 */
@RestController
public class HelloController {

    @RequestMapping("/hello")
    public String hello() {
        return "hello word!";
    }
}
