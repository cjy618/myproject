Router.route('/boardDetail', {
  path: '/boardDetail/:_id',
  onRun: function() {
    Session.set('userId', this.params._id);
    this.next();
  }
});

Template.boardDetail.helpers({
  userObj: function() {
    var userId = Session.get('userId');
    var userObj = Boards.findOne({_id: userId});
    //Boards.find({_id: userId}).fetch();
    return userObj;
  }

});

Template.boardDetail.events({
"click #reple": function(e, tmpl) {
  var obj = {};
  obj.작성자2=$('#작성자2').val();
  obj.댓글 = $('#댓글').val();
  if(obj.댓글.length <= 0 || obj.작성자2.length <= 0) {
    //error
    return alert('댓글과 작성자를 모두 입력해주세요!!');
  }
  Reple.insert(obj);

  $('#작성자2').val('');
  $('#댓글').val('');

  }});
