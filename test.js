var JiraAPI = require('./JiraAPI');
var jira = new JiraAPI("ThisFakeEmail@gmail.com", "MyPass1234", 'https://company.atlassian.net/');
jira.printMsg();
