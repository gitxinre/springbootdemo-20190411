package com.ly.springbootdemo20190411.common.cfg;

import org.activiti.engine.ProcessEngineConfiguration;
import org.activiti.engine.impl.history.HistoryLevel;
import org.activiti.spring.SpringProcessEngineConfiguration;
import org.apache.ibatis.session.SqlSessionFactory;
import org.mybatis.spring.SqlSessionFactoryBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.jdbc.DataSourceBuilder;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.ImportResource;
import org.springframework.context.annotation.Primary;
import org.springframework.core.io.DefaultResourceLoader;
import org.springframework.transaction.PlatformTransactionManager;

import javax.sql.DataSource;
import java.sql.SQLException;

/**
 * @author xinre
 * @date 2019/4/11 16:01
 */
@Configuration
@ImportResource("classpath:com/hq/bpmn/spring-hq-config.xml")
public class HqbpmnCfg {

    @Autowired
    private DataSource dataSource;

    @Bean
    @Primary
    @ConfigurationProperties(prefix = "spring.datasource")
    public DataSource hqbpmnDataSource() {
        return DataSourceBuilder.create().build();
    }

    @Bean(name = "sqlSessionFactoryBpmn")
    public SqlSessionFactory getSqlSessionFactory(DataSource dataSource) throws Exception {

        SqlSessionFactoryBean sqlSessionFactoryBean = new SqlSessionFactoryBean();
        sqlSessionFactoryBean.setDataSource(dataSource);
        sqlSessionFactoryBean.setConfigLocation(new DefaultResourceLoader().getResource("classpath:com/hq/bpmn/mybatis-config.xml"));
        //sqlSessionFactoryBean.setMapperLocations(new PathMatchingResourcePatternResolver().getResources("classpath*:com/hq/**/*SqlMap.xml"));
        return sqlSessionFactoryBean.getObject();
    }

    @Bean(name = "processEngineConfiguration")
    public ProcessEngineConfiguration getProcessEngineConfiguration(DataSource dataSource, PlatformTransactionManager platformTransactionManager) throws SQLException {
        System.out.println("platformTransactionManager = " + platformTransactionManager);
        SpringProcessEngineConfiguration springProcessEngineConfiguration = new SpringProcessEngineConfiguration();
        springProcessEngineConfiguration.setDataSource(dataSource);
        springProcessEngineConfiguration.setTransactionManager(platformTransactionManager);
        springProcessEngineConfiguration.setDatabaseSchemaUpdate(ProcessEngineConfiguration.DB_SCHEMA_UPDATE_FALSE);
        springProcessEngineConfiguration.setJobExecutorActivate(false);
        springProcessEngineConfiguration.setJpaHandleTransaction(true);
        springProcessEngineConfiguration.setHistory(HistoryLevel.AUDIT.getKey());
        return springProcessEngineConfiguration;
    }

}
