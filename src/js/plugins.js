var beautify = require('js-beautify').js_beautify;
var marked = require('marked');

$(document).ready(function ( ) {
    $('#git').html('<b>Git</b><br /><br />');
    $('#git').child("button").html('push').click(function () {
        git.push();
    });
    var form = $('#git').child('div').child('form');
    var commit_message = form.child('textarea');
    commit_message.get(0).placeholder = "Message du commit (enter pour envoyer)";

    commit_message.get(0).onkeydown = function (event) {
        if (event.keyCode === 13) {
            commit_message.get(0).style.display = "none";
            git.commit(commit_message.get(0).value, function () {
                commit_message.get(0).style.display = "block";
                alert('Commit effectué avec succès');                      
            }, function () {
                commit_message.get(0).style.display = "block";        
            })
            commit_message.get(0).value = "";
            return false;
        }

    }
    git.git_receiver = $('#git').child('div');
});

var git = {
    git_receiver : null,
    push : function () {
        require('simple-git')(folder[0]).push(function (error) {
            if(error != null){
                alert('Impossible de pusher' + error);
            }else{
                alert('Push effectué');
            }
        });
    },
    commit: function (text, callback, err) {
        require('simple-git')(folder[0]).add("./*").commit(text, function(error, infos) {
            if(error != null){
                alert('An error occured !');
                err();
            }else{
                callback();
            }
        });
    },
    status : function (callback) {
        require('simple-git')(folder[0]).add("./*").status(function (error, changes){
            if(error === null){
                callback(changes);
            }
        });
    },
    updateGitPanel : function (changes) {
       
        if(git.git_receiver == null){
            return;
        }

        var g = git.git_receiver;

        g.html("");

        var created_label = g.child('p').html('Créés (' + changes.created.length + ')');
        var created_list = g.child('div');

        addClickOnDir(created_label, created_list);

        for (var i = 0; i < changes.created.length; i++) {
            var created = changes.created[i];
            created_list.child('span').html("> " + created);
            created_list.child('br');
        }

        var modified_label = g.child('p').html('Modifiés (' + changes.modified.length + ')');
        var modified_list = g.child('div');

        addClickOnDir(modified_label, modified_list);

        for (var i = 0; i < changes.modified.length; i++) {
            var modified = changes.modified[i];
            modified_list.child('span').html("> " + modified);
            modified_list.child('br');
        }

        var deleted_label = g.child('p').html('Supprimés (' + changes.deleted.length + ')');
        var deleted_list = g.child('div');

        addClickOnDir(deleted_label, deleted_list);

        for (var i = 0; i < changes.deleted.length; i++) {
            var deleted = changes.deleted[i];
            deleted_list.child('span').html("> " + deleted);
            deleted_list.child('br');
        }

        var renamed_label = g.child('p').html('Renommés (' + changes.renamed.length + ')');
        var renamed_list = g.child('div');

        addClickOnDir(renamed_label, renamed_list);

        for (var i = 0; i < changes.renamed.length; i++) {
            var renamed = changes.renamed[i];
            renamed_list.child('span').html("> " + renamed);
            renamed_list.child('br');
        }
        
    }
}