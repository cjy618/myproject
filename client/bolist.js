Router.route('/bolist', 'bolist');

Session.set('curPageNum', 1);
Session.set('search', null);


Template.bolist.onCreated(function() {
    //1
    console.log('created');
    //var obj = {};
    //
    //for(var i = 0; i < 50; i++) {
    //  obj.제목 = i;
    //  obj.작성자 = Meteor.user();
    //  obj.글번호 = i;
    //  obj.본문 = i;
    //  Boards.insert(obj);
    //}

});

Template.bolist.onRendered(function() {
    //3
    console.log('rendered');
    //$('.table > tbody > tr').click(function() {
    //  // row was clicked
    //  Router.go('/boardDetail', {_id: });
    //});
});

Template.bolist.helpers({
    likeColor: function() {
        // this에 현재 라인의 데이터가 들어있다.
        var curArticle = this;
        var me = Meteor.user();
        if(!me) {
            return 'info';
        }

        var curData = Likes.findOne({'user._id': me._id, 'article._id': curArticle._id});
        if(curData) {
            return 'warning';
        }
        else {
            return 'info';
        }
    },
    //2
    boards: function () {
        // total = 전체 갯수 파악
        // curCount = 현재 페이지에 보여줄 갯수 = 10
        // curPageNum = 현재 페이지 넘버 = 1~페이지 수만큼
        var total = Boards.find({}).fetch().length;
        var curCount = 10;

        var condition = Session.get('search')
        if (condition == null) {
            condition = {};
        }
        else {
            condition = {제목: {$regex: condition}}
        }
        return Boards.find(condition, {
            limit: curCount,
            skip: (curCount*Session.get("curPageNum")) - curCount
        });
    },
    isLogin: function() {
        if(Meteor.user() === null
            || Meteor.user() === undefined) {
            //execute
            return false;
        }
        else return true;
    }

});

Template.bolist.events({
    "click #btnSearch": function(evt, tmpL) {
        var word = $('#inpSearch').val();
        Session.set('search', word);

    },
    "click #Prev": function(evt, tmpL) {
        var pn = Session.get('curPageNum');
        if(parseInt(pn) <= 1) {
            return alert('여기 첫페이지인걸?')
        }
        Session.set('curPageNum', --pn);
    },
    "click #Next": function(evt, tmpL) {
        var pn = Session.get('curPageNum');
        Session.set('curPageNum', ++pn);
    },
    "click #btnLike": function(evt, tmpl) {
        var user = Meteor.user();
        if(!user) {
            return alert('로그인을 반드시 해야하는데...');
        }
        var obj = {};
        obj.user = user;
        obj.article = this;
        Likes.insert(obj);
    },
    //4
    "click #removeOneItem": function(event, template) {
        //console.log(this);
        //var count = $(e.target).attr('count');
        //var obj = Boards.findOne({글번호: parseInt(count)});
        if(confirm('이 글을 소멸시키시겠습니까?')) {
            Boards.remove({
                _id: this._id
            });
        }
    },
    "click #cancels": function(e, tmpl) {
        $('#제목').val('');
        $('#본문').val('');
    },
    "click #writes": function(e, tmpl) {
        var obj = {};
        obj.작성자=$('#작성자').val();
        obj.제목 = $('#제목').val();
        obj.본문 = $('#본문').val();
        if(obj.제목.length <= 0 || obj.작성자.length <= 0) {
            //error
            return alert('제목과 내용을 모두 입력해주세요!!');
        }
        //글번호를 알아냅시다. 글번호 === 전체 글 갯수 + 1
        //글번호 max값 + 1로 수정
        var board = Boards.findOne({}, {sort: {'글번호': -1}});
        if(board !== undefined && board !== null) {
            if (board.hasOwnProperty('글번호')) {
                obj.글번호 = parseInt(board.글번호) + 1;
            }
        }
        else {
            obj.글번호 = 0;
        }

        Boards.insert(obj);

        $('#제목').val('');
        $('#본문').val('');
        $('#작성자').val('');
        Router.go('/bolist');
    }
});


