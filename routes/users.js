var express = require('express');
var router = express.Router();

//JavaScript用のSQL Query Builder
var knex = require('knex') ({
  dialect: 'sqlite3',
  connection: {
    filename: 'board_data.sqlite3'
  },
  useNullAsDefault: true
});

var Bookshelf = require('bookshelf')(knex);// ユーザー認証を行う

//ユーザーモデル
var User = Bookshelf.Model.extend({
  tableName: 'users'
});

// アカウント作成ページの処理
router.get('/add', function(req, res, next){
  var data = {
    title: 'User/Add',
    form: {name:'', password: '', comment:''},
    content: '＊登録する名前・パスワード・コメントを入力してください。'
  };
  res.render('users/add', data);// /add.ejsをレンダリング
});

// アカウント作成ページの処理
router.post('/add', function(req, res, next){
  var request = req;
  var response = res;
  req.check('name', 'NAME は必ず入力してください。').notEmpty();
  req.check('password', 'PASSWORD は必ず入力してください。').notEmpty();
  req.getValidationResult().then(function(result){
    if(!result.isEmpty()){
      var content = '<ul class="error">';
      var result_arr = result.array();
      for(var n in result_arr){
        content += '<li>' + result_arr[n].msg + '</li>';
      }
      content += '</ul>';
      var data = {
        title: 'User/Add',
        content: content,
        form: req.body
      };
      response.render('users/add', data);
    }else{
      request.session.login = null;
      new User(req.body).save().then(function(model){
        response.redirect('/');
      });
    }
  });
});

// ログインページの処理
router.get('/', function(req, res, next) {
  var data = {
    title: 'Users/Login',
    form: {name: '', password: ''},
    content: '名前とパスワードを入力してください。'
  };
  res.render('users/login', data);// login.ejsをレンダリング
});

//ログインページの処理
router.post('/', function(req, res, next) {
  var request = req;
  var response = res;
  req.check('name', 'NAME は必ず入力してください。').notEmpty();
  req.check('password', 'PASSWORD は必ず入力してください。').notEmpty();
  if(!result.isEmpty()){
    var content = '<ul class="error">';
    var result_arr = result.array();
    for(var n in result_arr){
      content += '<li>' + result_arr[n].msg + '</li>';
    }
    content += '</ul>';
    var data = {
      title: 'User/Login',
      content: content,
      form: req.body
    };
    response.render('users/login', data);
  }else{
    var nm = req.body.name;
    var pw = req.boby.password;
    User.query({where: {name: nm}, andWhere: {password: pw}})
      .fetch()
      .then(function(model){
        if(model == null){
          var data = {
            title: '再入力',
            content: '<p class="error">名前またはパスワードが違います。</p>',
            form: req.body
          };
          response.render('users/login', data);
        }else{
          request.session.login = model.attributes;
          var data = {
            title: 'User/Login',
            content: '<p>ログインしました！<br>トップページに戻ってメッセージを送信してください。</p>',
            form: req.boby
          };
          response.render('user/login', data);
        }
      });
  }
});

module.exports = router;
