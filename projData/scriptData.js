const questionModel = {
    _questionId: "question_id",
    questionUrl: "question_url",
    topicName: "topic_name",
    questionName: "question_name",
    level: "level",
    platform: "platform"
}


const userQuestionModel = {
    _userquestionsId: "userquestions_id",
    userId: "user_id",
    questionId: "question_id",
    topicName: "topic_name",
    date: "date"
}

const userAuthModel = {
    _userId: 'user_id',
    username: 'username',
    password: 'password',
}

module.exports = {questionModel, userQuestionModel, userAuthModel}