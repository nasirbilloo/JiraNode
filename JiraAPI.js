var async = require('async');
var request = require('request');
var logger = require('../util/logger');

/*

https://docs.atlassian.com/greenhopper/REST/cloud/
https://docs.atlassian.com/jira/REST/ondemand/
https://developer.atlassian.com/static/connect/docs/latest/scopes/jira-agile-rest-scopes.html


*/
var JiraAPI = function (user, pass, url) {
    this.user = user;
    this.pass = pass;
    this.baseURL = url;
    this.debug = false;

    this.authHeader = {
        timeout: 1000,
        username: this.user,
        password: this.pass
    };
    this.authHeader2 = {
        'auth': {
            'user': this.user,
            'pass': this.pass
        }
    }
};


JiraAPI.prototype = {
    /**
    agile/1.0/boardExpand all methods
    Get all boards
    GET /rest/agile/1.0/board
    */
    getRestDataWOParams: function (url, functionID, cb) {
        if (this.debug) logger.debug("getRestDataWOParams");
        var self = this;
        request.get(url, this.authHeader2, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                if (this.debug) logger.debug("URL: " + url);
                return cb(null, JSON.parse(body));
            } else {
                if (this.debug) logger.debug("URL: " + url);
                var errorMsg = "Error when getting data from Jira in JiraAPI:" + functionID;
                if (error) errorMsg = ", Error in " + functionID + ", error: " + error;
                if (response && response.statusCode && response.statusCode != 200) {
                    if (response.statusCode == 400) {
                        errorMsg += ", invalid paramater provided issue.";
                    } else if (response.statusCode == 401) {
                        errorMsg += ", the calling user is not authenticated.";
                    } else if (response.statusCode == 403) {
                        errorMsg += ", the calling user does not have permission to get this data";
                    } else if (response.statusCode == 404) {
                        errorMsg += ", remote link does or data requested does not exist";
                    } else {
                        errorMsg += ", unknown status code: " + response.statusCode;
                    }
                }
                logger.error(errorMsg);
                if (this.debug) logger.debug(error);
                return cb(errorMsg, null);
            }
        });
    },
    /**
    api / 2 / issuetype    
    */
    login: function (username, password, cb) {
        var url = this.baseURL + "rest/auth/1/session";
        var self = this;
        var data = {
            'headers': {
                'Content-Type': 'application/json'
            },
            'Content-Type': 'application/json',
            'form': {
                'username': username,
                'password': password
            },
            'auth': {
                'user': username,
                'pass': password
            }
        };

        request.post(url, JSON.stringify(data), function (error, response, body) {
            if (!error && response.statusCode == 200) {
                return cb(null, "Login Successful");
            } else {
                logger.error(response.statusCode);
                logger.debug(body);
                return cb("Error logging into Jira", null);
            }
        });
        //return this.getRestDataWOParams(url, "login", cb);
    },
    /**
    api / 2 / issuetype
    */
    getIssueTypes: function (cb) {
        var url = this.baseURL + "rest/api/2/issuetype";
        return this.getRestDataWOParams(url, "getIssueTypes", cb);
    },
    /**
    api / 2 / issuetype /{id}   
    */
    getSingleIssueType: function (issueTypeId, cb) {
        var url = this.baseURL + "rest/api/2/issuetype" + "/" + issueTypeId;
        return this.getRestDataWOParams(url, "getSingleIssueType", cb);
    },
    /**
    api / 2 / priority    
    */
    getPriorities: function (cb) {
        var url = this.baseURL + "rest/api/2/priority";
        return this.getRestDataWOParams(url, "getPriorities", cb);
    },
    /**
    api / 2 / priority /{id}   
    */
    getSinglePriority: function (priorityId, cb) {
        var url = this.baseURL + "rest/api/2/priority" + "/" + priorityId;
        return this.getRestDataWOParams(url, "getSinglePriority", cb);
    },
    /**
    api / 2 / project    
    */
    getProjects: function (cb) {
        var url = this.baseURL + "rest/api/2/project?expand=description,lead,url,projectKeys";
        return this.getRestDataWOParams(url, "getProjects", cb);
    },
    /**
    api / 2 / project /{id}   
    */
    getSingleProject: function (projectId, cb) {
        var url = this.baseURL + "rest/api/2/project/" + projectId;
        return this.getRestDataWOParams(url, "getSingleProject", cb);
    },
    /**
    api / 2 / project /{id}/properties   
    */
    getSingleProjectProperties: function (projectId, cb) {
        var url = this.baseURL + "rest/api/2/project/" + projectId + "/properties";
        return this.getRestDataWOParams(url, "getSingleProjectProperties", cb);
    },
    /**
    api / 2 / project / type   
    */
    getProjectTypes: function (cb) {
        var url = this.baseURL + "rest/api/2/project/type";
        return this.getRestDataWOParams(url, "getProjectTypes", cb);
    },
    /**
    api / 2 / project / type / {id}   
    */
    getSingleProjectType: function (projectTypeId, cb) {
        var url = this.baseURL + "rest/api/2/project/type/" + projectTypeId;
        return this.getRestDataWOParams(url, "getSingleProjectType", cb);
    },
    /**
    api / 2 / projectCategory   
    */
    getProjectCategories: function (cb) {
        var url = this.baseURL + "rest/api/2/projectCategory";
        return this.getRestDataWOParams(url, "getProjectCategory", cb);
    },
    /**
    api / 2 / projectCategory / {id}   
    */
    getSingleProjectCategory: function (projectCategoryId, cb) {
        var url = this.baseURL + "rest/api/2/projectCategory/" + projectCategoryId;
        return this.getRestDataWOParams(url, "getSingleProjectCategory", cb);
    },
    /**
    api / 2 / status    
    */
    getStatuses: function (cb) {
        var url = this.baseURL + "rest/api/2/status";
        return this.getRestDataWOParams(url, "getStatuses", cb);
    },
    /**
    api / 2 / status /{id}   
    */
    getSingleStatus: function (statusId, cb) {
        var url = this.baseURL + "rest/api/2/status" + "/" + statusId;
        return this.getRestDataWOParams(url, "getSingleStatus", cb);
    },
    /**
    api / 2 / statuscategory    
    */
    getStatusCategories: function (cb) {
        var url = this.baseURL + "rest/api/2/statuscategory";
        return this.getRestDataWOParams(url, "getStatusCategories", cb);
    },
    /**
    api / 2 / statuscategory /{id}   
    */
    getSingleStatusCategory: function (statusCategoryId, cb) {
        var url = this.baseURL + "rest/api/2/statuscategory/" + statusCategoryId;
        return this.getRestDataWOParams(url, "getSingleStatusCategory", cb);
    },
    /**
    api / 2 / user / search    
    */
    findUsers: function (searchString, cb) {
        var self = this;
        var url = this.baseURL + "rest/api/2/user/search?username=" + searchString;
        if (this.debug) logger.debug("URL: " + url);
        request.get(url, this.authHeader2, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                return cb(null, JSON.parse(body));
            } else {
                logger.error("Error in findUsers, statuscode: " + ", message: " + error);
                if (this.debug) logger.debug(error);
                return cb(error, null);
            }
        });
    },
    /**
     * https://company.atlassian.net/rest/tempo-timesheets/3/worklogs/ID
     */
    getWorklogFromTempo:function (workLogId, cb) {
        var self = this;
        var url = this.baseURL + "rest/tempo-timesheets/3/worklogs/" + workLogId;
        logger.info("URL: " + url);
        request.get(url, this.authHeader2, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                return cb(null, JSON.parse(body));
            } else {
                if (this.debug) logger.error("Error in getWorklogFromTempo, statuscode: " + ", message: " + error);
                logger.error(error);
                return cb(error, null);
            }
        });
    },
    /**
     * https://company.atlassian.net/rest/tempo-timesheets/3/worklogs/ID
     */
    getWorklogsUpdatedSince:function (farbackDt, cb) {
        var self = this;
        var url = this.baseURL + "rest/api/2/worklog/updated?since=" + farbackDt.getTime();
        if (this.debug) logger.info("URL: " + url);
        request.get(url, this.authHeader2, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                return cb(null, JSON.parse(body));
            } else {
                if (this.debug) logger.error("Error in getWorklogFromTempo, statuscode: " + ", message: " + error);
                logger.error(error);
                return cb(error, null);
            }
        });
    },    
    /**
    api / 2 / user   
    */
    getSingleUser: function (username, cb) {
        var url = this.baseURL + "rest/api/2/user?username=" + username;
        return this.getRestDataWOParams(url, "getSingleUser", cb);
    },
    /**
    api / 2 / field    
    */
    getFields: function (cb) {
        var url = this.baseURL + "rest/api/2/field";
        return this.getRestDataWOParams(url, "getCustomFields", cb);
    },
    /**
    api / 2 / dashboard    
    */
    getDashboards: function (cb) {
        var url = this.baseURL + "rest/api/2/dashboard";
        return this.getRestDataWOParams(url, "getDashboards", cb);
    },
    getRestDataWithAsynchWhilestAPI1: function (url, dataKey, functionName, cb) {
        if (this.debug) logger.debug("getRestDataWithAsynchWhilestAPI1");
        var self = this;
        var next = url;
        var startAt = 0;
        var maxResults = 0;
        var total = 0;
        var isLast = false;
        var data = [];
        var count = 0;
        async.whilst(
            function () {
                if (this.debug) logger.debug("IsLast? " + isLast);
                return !isLast;
            },
            function (callback) {
                if (this.debug) logger.debug("In whilst fn for getRestDataWithAsynchWhilestAPI1 " + count++);
                var next = url + "?startAt=" + startAt;
                self.getRestDataWOParams(next, functionName, function (err, result) {
                    if (err) {
                        callback("Invalid result in " + functionName);
                        return cb(err, null);
                    } else {
                        if (this.debug) logger.debug("In whilst fn for getRestDataWithAsynchWhilestAPI1, results:");
                        next = result.next;
                        startAt = startAt + result.maxResults;
                        isLast = result.isLast;
                        total = result.total;
                        maxResults = result.maxResults;
                        if (startAt == 0 && maxResults == 0 && total == 0) {
                            callback("No Data Found");
                            return cb(null, data);
                        } else {
                            data = data.concat(result[dataKey]);
                            callback();
                        }
                    }
                })
            },
            function (err) {
                if (err) {
                    if (this.debug) logger.debug("err");
                } else {
                    if (this.debug) logger.debug("Done with Whilst");
                    return cb(null, data);
                }
            }
        );
        //return cb(null, data);
    },
    /**
    agile/1.0/boardExpand all methods
    Get all boards
    GET /rest/agile/1.0/board
    */
    /*
    getRestDataWOParamsAPI2Ex: function (keyword, dataKey, functionID, cb) {
        var url = this.baseURL + "rest/api/2/" + keyword;
        if (this.debug) logger.debug("getRestDataWOParams");
        var self = this;
        request.get(url, this.authHeader2, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                if (this.debug) logger.debug("URL: " + url);
                return cb(null, JSON.parse(body[dataKey]));
            } else {
                if (this.debug) logger.debug("URL: " + url);
                logger.error("Error in " + functionID + ", statuscode: " + ", message: " + error);
                if (this.debug) logger.debug(error);
                return cb(error, null);
            }
        });
    },
    */
    getRestDataWOParamsAPI2: function (url, dataKey, functionName, cb) {
        //var url = this.baseURL + "rest/api/2/" + keyword;
        var self = this;
        var next = url;
        var startAt = 0;
        var maxResults = 0;
        var total = 0;
        var data = [];
        async.whilst(
            function () {
                if (!next) {
                    return false;
                } else {
                    return true;
                }
            },
            function (callback) {
                self.getRestDataWOParams(next, functionName, function (err, result) {
                    if (err) {
                        callback("Invalid result in " + functionName);
                        return cb(err, null);
                    } else {
                        next = result.next;
                        startAt = result.startAt;
                        maxResults = result.maxResults;
                        total = result.total;
                        //logger.info("startAt: " + startAt + ", maxResults: " + maxResults + ", total: " + total);
                        if (startAt == 0 && maxResults == 0 && total == 0) {
                            callback("No Data Found");
                            return cb(null, data);
                        } else {
                            data = data.concat(result[dataKey]);
                            callback();
                        }
                    }
                })
            },
            function (err) {
                if (err) {
                    logger.error("err: " + err);
                } else {
                    //logger.error("Done with Whilst Loop2");
                    return cb(null, data);
                }
            }
        );
        //logger.debug("Out of Whilst Loop2");
        //return cb(null, data);
    },
    getRestDataSearch: function (keyword, dataKey, functionName, cb) {
        var url = this.baseURL + "rest/api/2/" + keyword;
        var self = this;
        var next = url;
        var count = 0;
        var total = 10;
        var startAt = 0;
        var maxResults = 0;
        var data = [];
        async.whilst(
            function () {
                if (count >= total) {
                    return false;
                } else {
                    return true;
                }
            },
            function (callback) {
                self.getRestDataWOParams(next, functionName, function (err, result) {
                    if (err) {
                        callback("Invalid result in " + functionName);
                        return cb(err, null);
                    } else {
                        count = count + result.maxResults;
                        total = result.total;
                        next = url + "&startAt=" + count
                        startAt = result.startAt;
                        maxResults = result.maxResults;
                        if (startAt == 0 && maxResults == 0 && total == 0) {
                            callback("No Data Found");
                            return cb(null, data);
                        } else {
                            data = data.concat(result[dataKey]);
                            callback();
                        }
                    }
                })
            },
            function (err) {
                if (err) {
                    logger.error("err: " + err);
                } else {
                    return cb(null, data);
                }
            }
        );
    },
    getRestDataWOParamsAPI1: function (keyword, dataKey, functionName, cb) {
        var url = this.baseURL + "rest/agile/1.0/" + keyword;
        return this.getRestDataWithAsynchWhilestAPI1(url, dataKey, functionName, cb);
    },
    getRestDataWithParamAPI1: function (keyword, dataKey, param1, keyword2, functionName, cb) {
        if (this.debug) logger.debug("getRestDataWithParamAPI1");
        var url = this.baseURL + "rest/agile/1.0/" + keyword + "/" + param1 + "/" + keyword2;
        return this.getRestDataWithAsynchWhilestAPI1(url, dataKey, functionName, cb);
    },
    ///rest/api/2/issue/{issueIdOrKey}/worklog
    //getRestDataWithParamAPI2("issue","worklogs",issueId, "worklog", "getIssueWorklog", function(err, data){}
    getRestDataWithParamAPI2: function (keyword, dataKey, param1, keyword2, functionName, cb) {
        if (this.debug) logger.debug("getRestDataWithParamAPI1");
        var url = this.baseURL + "rest/api/2/" + keyword + "/" + param1 + "/" + keyword2;
        return this.getRestDataWOParamsAPI2(url, dataKey, functionName, cb);
    },
    getRestDataWith2ParamAPI1: function (keyword, dataKey, param1, keyword2, param2, keyword3, functionName, cb) {
        var url = this.baseURL + "rest/agile/1.0/" + keyword + "/" + param1 + "/" + keyword2 + "/" + param2 + "/" + keyword3;
        return this.getRestDataWithAsynchWhilestAPI1(url, dataKey, functionName, cb);
    },
    getDashboardsEx: function (cb) {
        var url = this.baseURL + "rest/api/2/dashboard/";
        return this.getRestDataWOParamsAPI2(url, "dashboards", "getDashboardsEx", cb);
    },
    /**
    api / 2 / dashboard /{id}   
    */
    getSingleDashboard: function (dashboardId, cb) {
        var self = this;
        var url = this.baseURL + "rest/api/2/dashboard/" + dashboardId;
        return this.getRestDataWOParams(url, "getSingleDashboard", cb);
    },
    /**
    api / 2 / issue /{id}   
    */
    getSingleIssue: function (issueId, cb) {
        var self = this;
        var url = this.baseURL + "rest/api/2/issue/" + issueId + "?expand=changelog,transitions";
        return this.getRestDataWOParams(url, "getSingleIssue", cb);
    },
    ///rest/api/2/issue/{issueIdOrKey}/worklog
    //getRestDataWithParamAPI2("issue","worklogs",issueId, "worklog", "getIssueWorklog", function(err, data){}
    //getRestDataWithParamAPI2: function (keyword, dataKey, param1, keyword2, functionName, cb) {

    getIssueWorklogs: function (issueId, cb) {
        return this.getRestDataWithParamAPI2("issue", "worklogs", issueId, "worklog", "getIssueWorklog", cb);
    },

    /**
    agile / 1.0 / board    
    */
    getBoards: function (cb) {
        var url = this.baseURL + "/rest/agile/1.0/board";
        return this.getRestDataWOParams(url, "getBoards", cb);
    },
    /**
    agile / 1.0 / board    
    */
    getBoardsEx: function (cb) {
        return this.getRestDataWOParamsAPI1("board", "values", "getBoardsEx", cb);
    },
    /**
    agile / 1.0 / board      
    */
    getSingleBoard: function (boardId, cb) {
        var url = this.baseURL + "/rest/agile/1.0/board/" + boardId;
        return this.getRestDataWOParams(url, "getSingleBoard", cb);
    },
    /**
    agile / 1.0 / board      
    */
    getBoardIssues: function (boardId, cb) {
        var url = this.baseURL + "/rest/agile/1.0/board/" + boardId + "/issue";
        return this.getRestDataWOParams(url, "getBoardIssues", cb);
    },
    /**
    agile / 1.0 / board      
    */
    getBoardEpics: function (boardId, cb) {
        var url = this.baseURL + "/rest/agile/1.0/board/" + boardId + "/epic";
        return this.getRestDataWOParams(url, "getSingleBoard", cb);
    },
    /**
    agile / 1.0 / board      
    */
    getBoardEpicsEx: function (boardId, cb) {
        if (this.debug) logger.debug("getBoardEpicsEx");
        return this.getRestDataWithParamAPI1("board", "values", boardId, "epic", "getBoardEpicsEx", cb);
    },
    /**
    agile / 1.0 / board      
    */
    getBoardEpicIssuessEx: function (boardId, epicId, cb) {
        return this.getRestDataWithParamAPI2("board", "values", boardId, "epic", epicId, "issue", "getBoardEpicsEx", cb);
    },
    /**
    agile / 1.0 / board      
    */
    getBoardIssuesEx: function (boardId, cb) {
        return this.getRestDataWithParamAPI1("board", "values", boardId, "issue", "getBoardIssuesEx", cb);
    },
    /*
    Closed: jql=status%20!%3D%20Closed
    Not Closed: https://company.atlassian.net/issues/?jql=status%20!%3D%20Closed
    /rest/api/2/search
    */
    getAllClosedIssues: function (cb) {
        return this.getRestDataSearch("search?jql=status%20!%3D%20Closed", "issues", "getAllClosedIssues", cb);
    },
    getAllOpenIssues: function (cb) {
        return this.getRestDataSearch("search?jql=status%20!%3D%20Closed", "issues", "getAllOpenIssues", cb);
    },
    searchWithJQL: function (jql, cb) {
        return this.getRestDataSearch("search?jql=" + jql, "issues", "searchWithJQL", cb);
    },
    printMsg: function(){
        console.log("This module uses Jira's REST API to do stuff");
    }
};
module.exports = JiraAPI;
