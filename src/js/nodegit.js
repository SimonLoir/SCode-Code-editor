const nodegit = require('nodegit');
var changes_list = [];
$(document).ready(function () {
  setInterval(function () {
    changes_list = [];
    if (folder != null) {
      nodegit.Repository.open(folder[0]).then(function (repo) {
        repo.getStatus().then(function (statuses) {
          function statusToText(status) {
            var words = [];
            if (status.isNew()) { words.push("NEW"); }
            if (status.isModified()) { words.push("MODIFIED"); }
            if (status.isTypechange()) { words.push("TYPECHANGE"); }
            if (status.isRenamed()) { words.push("RENAMED"); }
            if (status.isIgnored()) { words.push("IGNORED"); }

            return words.join(" ");
          }

          statuses.forEach(function (file) {
            changes_list.push({
              file: file.path(),
              status: statusToText(file)
            })
          });
          console.log(changes_list.length + " change(s)")
        });

      });
    }
  }, 2000);
});