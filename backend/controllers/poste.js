const NewPostUser = require("../models/poste.js");
var mongoose = require("mongoose");
var fs = require("fs");

const auth = require("../middleware/auth");

exports.newPost = async (req, res, next) => {
  // console.log(req.file);
  console.log(req.body.text);

  var reg = /^[^@&"()!_$*€£`+=\/;?#]+$/;
  if (req.body.text.match(reg)) {
    try {
      var postUser;
      if (req.file == undefined) {
        console.log("pas d'image ");
        postUser = new NewPostUser({
          userId: req.body.userId,
          nom: req.body.nom,
          prenom: req.body.prenom,
          inputTextPost: req.body.text,
          datePost: req.body.datePost,
        });
        postUser
          .save()
          .then(() => {
            res.status(201).json({ message: "post créé sans image !" });
          })
          .catch((error) => {
            res.status(400).json({ error });
          });
      } else if (req.file.mimetype == "image/png") {
        postUser = new NewPostUser({
          userId: req.body.userId,
          nom: req.body.nom,
          prenom: req.body.prenom,
          inputTextPost: req.body.text,
          datePost: req.body.datePost,
          image: req.file.filename,
        });
        postUser
          .save()
          .then(() => {
            res.status(201).json({ message: "post créé avec image !" });
          })
          .catch((error) => {
            res.status(400).json({ error });
          });
      }
    } catch (errors) {
      return res.status(405).json({ errors: errors.message });
    }
  } else {
    return res.status(405).json({ errors: errors.message });
  }
};

exports.getAllPost = (req, res, next) => {
  NewPostUser.find()
    .then((post) => {
      res.status(200).json(post);
    })
    .catch((error) => res.status(400).json({ error }));
};

exports.getPostSelected = (req, res, next) => {
  // console.log(req.body.idPost);
  NewPostUser.findOne({ _id: req.body.idPost }).then((post) => {
    if (!post) {
      return res.status(401).json({ message: "erreur incorrecte" });
    } else {
      res.status(200).json({
        success: "Post trouvé ! ",
        inputTextPost: post.inputTextPost,
        image: post.image,
        idUserPost: post.userId,
      });
    }
  });
};

exports.deleteposte = async (req, res, next) => {
  console.log("Delete : ");
  console.log("iduser", req.body.userId);
  console.log("idPostUser", req.body.idPostUser);
  console.log("administrateur", req.body.administrateur);
  //Vérification que c'est bien le créateur du post ou un admin qui modifie le post
  if (
    req.body.administrateur == "true" ||
    req.body.idPostUser == req.body.userId
  ) {
    try {
      const deleteposteId = await NewPostUser.findById(req.params.id);
      await deleteposteId.remove();

      // delete file named 'sample.txt'
      if (deleteposteId.image) {
        fs.unlink(`images/${deleteposteId.image}`, function (err) {
          if (err) throw err;
          // if no error, file has been deleted successfully
        });
      }

      response.status(201).json({ message: "suppression réussie" });
    } catch (e) {
      res.status(404).json({ error: "error !!" });
    }
  }
};

exports.update = (req, res, next) => {
  console.log("update post : ");
  console.log("iduser", req.body.userId);
  console.log("idPostUser", req.body.idPostUser);
  console.log("administrateur", req.body.administrateur);
  //Vérification que c'est bien le créateur du post ou un admin qui modifie le post
  if (
    req.body.administrateur == "true" ||
    req.body.idPostUser == req.body.userId
  ) {
    NewPostUser.updateOne(
      { _id: req.params.id },
      { ...req.body, _id: req.params.id }
    )
      .then(res.status(200).json({ message: "Post modifié" }))
      .catch((error) => res.status(400).json({ error }));
  }
};

exports.upload2 = async (req, res, next) => {
  try {
    // delete file named 'sample.txt'
    // fs.unlink(`images/${req.body.oldimage}`, function (err) {
    //   if (err) throw err;
    //   // if no error, file has been deleted successfully

    // });

    await res.status(201).json({ message: req.file.filename });
  } catch (errors) {
    await res.status(405).json({ errors: errors.message });
  }
};

exports.postlike = (req, res, next) => {
  switch (req.body.case) {
    //check if the user had liked or disliked the sauce
    //uptade the sauce, send message/error

    case 1:
      NewPostUser.findOne({ _id: req.params.id }).then((post) => {
        if (post.usersLiked.length != 0) {
          for (var i = 0; i < post.usersLiked.length; i++) {
            // Quand l'utilisateur existe déjà (donc like -1)
            if (req.body.userid[2] === post.usersLiked[i]) {
              var searchUserLike = 1;
              // Quand l'utilisateur existe pas (donc like +1)
            } else {
              var searchUserLike = 0;
            }
          }
        } else {
          var searchUserLike = 0;
        }

        post.usersLiked.push(req.body.userid[2]);

        if (searchUserLike == 0) {
          likes = post.like + 1;
          NewPostUser.updateOne(
            { _id: req.params.id },
            {
              like: post.like + 1,
              usersLiked: post.usersLiked,
              _id: req.params.id,
            }
          )
            .then(() => {
              console.log("postUpdateeeee");
              const Newpost = NewPostUser.findOne({ _id: req.params.id }).then(
                (Newpost) => {
                  console.log(Newpost);
                  res.status(201).json({ Newpost });
                }
              );
            })

            .catch((error) => {
              res.status(400).json({ error: error });
            });
        } else {
          deleteUser = post.usersLiked.filter((e) => e !== req.body.userid[2]);
          likes = post.like - 1;

          NewPostUser.updateOne(
            { _id: req.params.id },
            {
              like: likes,
              usersLiked: deleteUser,
              _id: req.params.id,
            }
          )
            .then(() => {
              console.log("postUpdateeeee");
              const Newpost = NewPostUser.findOne({ _id: req.params.id }).then(
                (Newpost) => {
                  console.log(Newpost);
                  res.status(201).json({ Newpost });
                }
              );
            })
            .catch((error) => {
              res.status(400).json({ error: error });
            });
        }
      });
      break;
  }
};

exports.updateCommentaire = (req, res, next) => {
  var postUser;
  var postcommentaire;
  NewPostUser.findOne({ _id: req.params.id }).then((post) => {
    postUser = post.userCommentaire;
    postcommentaire = post.commentaire;

    postUser.push(req.body.userCommentaire);
    postcommentaire.push(req.body.commentaire);

    NewPostUser.updateOne(
      { _id: req.params.id },
      {
        commentaire: postcommentaire,
        userCommentaire: postUser,
        _id: req.params.id,
      }
    )
      .then(res.status(200).json({ message: "commentaire Ajouté" }))
      .catch((error) => res.status(400).json({ error }));
  });
};

exports.deleteCommentaire = (req, res, next) => {
  var postUser;
  var postcommentaire;
  NewPostUser.findOne({ _id: req.params.id }).then((post) => {
    postUser = post.userCommentaire;
    postcommentaire = post.commentaire;

    var index = postcommentaire.indexOf(req.body.commentaire[req.body.index]);
    if (index > -1) {
      postcommentaire.splice(index, 1); // Remove array element
    }

    var index2 = postUser.indexOf(req.body.userCommentaire[req.body.index]);
    if (index > -1) {
      postUser.splice(index2, 1); // Remove array element
    }

    NewPostUser.updateOne(
      { _id: req.params.id },
      {
        commentaire: postcommentaire,
        userCommentaire: postUser,
        _id: req.params.id,
      }
    )
      .then(res.status(200).json({ message: "commentaire Supprimé" }))
      .catch((error) => res.status(400).json({ error }));
  });
};
