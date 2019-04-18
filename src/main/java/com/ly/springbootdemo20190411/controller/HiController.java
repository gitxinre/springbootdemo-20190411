package com.ly.springbootdemo20190411.controller;

import com.hq.bpmn.common.bean.ProcessResult;
import com.hq.bpmn.exception.BpmnException;
import com.hq.bpmn.processinstance.bean.BpmnTicket;
import com.hq.bpmn.unify.service.BpmnService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;

/**
 * @author xinre
 * @date 2019/4/11 13:40
 */
@Controller
public class HiController {

    @Autowired
    private BpmnService bpmnService;

    @RequestMapping("/hi")
    public String hi() {
        return "index";
    }

    @RequestMapping("/demo01")
    public String demo01() {
        return "hqbpmn/template/tempList";
    }

    @RequestMapping("/demo02")
    public String demo02() {
        try {
            ProcessResult<List<BpmnTicket>> listProcessResult = bpmnService.batchCreateBpmnProcessWithNextTask("a", "zclc", "20190412001", "");
            System.out.println("listProcessResult.getResult().size() = " + listProcessResult.getResult().size());
        } catch (BpmnException e) {
            e.printStackTrace();
        }
        return "index";
    }

}
