exports.init = function () {
    return {
        git_receiver: null,
        push: function () {
            require('simple-git')(folder[0]).push(function (error) {
                if (error != null) {
                    alert(language.cantPush + error);
                } else {
                    alert(language.pushDone);
                }
            });
        },
        commit: function (text, callback, err) {
            require('simple-git')(folder[0]).add("./*").commit(text, function (error, infos) {
                if (error != null) {
                    alert('An error occured !');
                    err();
                } else {
                    callback();
                }
            });
        },
        status: function (callback) {
            require('simple-git')(folder[0]).add("./*").status(function (error, changes) {
                if (error === null) {
                    callback(changes);
                }
            });
        },
        updateGitPanel: function (changes) {

            if (git.git_receiver == null) {
                return;
            }

            var g = git.git_receiver;

            g.html("");
            
            var created_label = g.child('p').html(language.created + ' (' + changes.created.length + ')');
            var created_list = g.child('div');
            
            editor.addClickOnDir(created_label, created_list);
            
            for (var i = 0; i < changes.created.length; i++) {
                var created = changes.created[i];
                created_list.child('span').html("> " + created);
                created_list.child('br');
            }
            
            var modified_label = g.child('p').html(language.modified + ' (' + changes.modified.length + ')');
            var modified_list = g.child('div');
            
            editor.addClickOnDir(modified_label, modified_list);
            
            for (var i = 0; i < changes.modified.length; i++) {
                var modified = changes.modified[i];
                modified_list.child('span').html("> " + modified);
                modified_list.child('br');
            }
            
            var deleted_label = g.child('p').html(language.removed + ' (' + changes.deleted.length + ')');
            var deleted_list = g.child('div');
            
            editor.addClickOnDir(deleted_label, deleted_list);
            
            for (var i = 0; i < changes.deleted.length; i++) {
                var deleted = changes.deleted[i];
                deleted_list.child('span').html("> " + deleted);
                deleted_list.child('br');
            }
            
            var renamed_label = g.child('p').html(language.renamed + ' (' + changes.renamed.length + ')');
            var renamed_list = g.child('div');
            
            editor.addClickOnDir(renamed_label, renamed_list);
            
            $('#git_status').html("git (" + 
            (changes.created.length +
            changes.modified.length + 
            changes.deleted.length + 
            changes.renamed.length) + ")")

            
            for (var i = 0; i < changes.renamed.length; i++) {
                var renamed = changes.renamed[i];
                renamed_list.child('span').html("> " + renamed.from + " -> " + renamed.to);
                renamed_list.child('br');
            }

        }
    };
}