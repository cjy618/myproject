Template.header.helpers({
    //2
    boards: function () {
        return Boards.find({});
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