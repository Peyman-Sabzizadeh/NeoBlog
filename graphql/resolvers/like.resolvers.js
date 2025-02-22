import { Article, Like, User } from "../../configs/db.js";
import { authGuard } from "../../utils/authGuard.js";
export const addLike = async (_, { articleId }, context) => {
  const user = await authGuard(context.req);

  const existingArticle = await Article.findOne({ where: { id: articleId } });

  if (!existingArticle) {
    return {
      success: false,
      error: true,
      message: "مقاله یافت نشد !!",
    };
  }
  const checkArticleLiked = await Like.findOne({
    where: {
      article_id: articleId,
      user_id: user.id
           }
  });

  if (checkArticleLiked) {
    return {
      success: false,
      error: true,
      message: "مقاله  از قبل لایک شده است !!",
    };
  }

  await Like.create({ article_id: articleId, user_id: user.id });

  return {
    success: true,
    error: false,
    message: "مقاله لایک شد. ",
  };
};
export const disLike = async (_, { articleId }, context) => {
  const user = await authGuard(context.req);

  const existingArticle = await Article.findOne({ where: { id: articleId } });

  if (!existingArticle) {
    return {
      success: false,
      error: true,
      message: "مقاله یافت نشد !!",
    };
  }

  const getUserLike = await Like.findOne({
    where: {
      article_id: articleId,
      user_id: user.id,
    },
  });

  if (!getUserLike) {
    return {
      success: false,
      error: true,
      message: "مقاله سیو شده برای شما نیست یا پیدا نشد !!",
    };
  }

  await Like.destroy({
    where: {
      article_id: articleId,
      user_id: user.id,
    },
  });

  return {
    success: true,
    error: false,
    message: "مقاله با موفقیت dislike شد !!",
  };
};
export const getAllLikes = async (_, { articleId: id }) => {
  const likes = await Like.findAll({
    where: { article_id: id },
    include: [
      {
        model: User,
        attributes: {
          exclude: ["password"],
        },
      },
    ],

    order: [["created_at", "DESC"]],
  });
  
  if (!likes.length) {
    throw new Error("لیست لایک های این مقاله خالی است")
  }
  return likes;
};

export const getArticleLikesCount = async (_, { articleId }) => {
  const existingArticle = await Article.findOne({ where: { id: articleId } });

  if (!existingArticle) {
    return {
      success: false,
      error: true,
      message: "مقاله یافت نشد !!",
    };
  }

  let likes = await Like.findAndCountAll({
    where: {
      article_id: articleId,
    },
  });


  return {
    success: true,
    error: false,
    message: "تعداد لایک های این مقاله: 👇",
    count: likes.count,
  };
};
