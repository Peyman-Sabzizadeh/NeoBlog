import * as userTypes from "./types/user.types.js";
import * as verificationsTypes from "./types/verifications.types.js";
import * as responsesTypes from "./types/responses.types.js";
import * as articleTypes from "./types/article.types.js";
import * as fileTypes from "./types/file.types.js";
import * as tagTypes from "./types/tag.types.js";
import * as bookMarkTypes from "./types/bookMark.types.js";
import * as likeTypes from "./types/like.types.js";

export const schema = `
      scalar Upload

      ${userTypes.Auth}
      ${userTypes.User}
      ${userTypes.UserRole}
      ${userTypes.OptionalUserInput}
      ${verificationsTypes.Captcha}
      ${verificationsTypes.Otp}
      ${verificationsTypes.AccessToken}
      ${responsesTypes.Response}
      ${responsesTypes.Count}
      ${articleTypes.Article}
      ${articleTypes.Tag}
      ${articleTypes.createArticleInput}
      ${fileTypes.File}
      ${tagTypes.Tag}
      ${likeTypes.Like}
      ${bookMarkTypes.BookMark}
       
      type Query {
      users (page: Int!, limit: Int!): [User!]!
      user (id: ID!): User!
      generateCaptcha: Captcha!
      refreshToken: AccessToken!
      getMe: User!
      getAllAdmins: [User!]!
      findAllArticle (page: Int!, limit: Int!): [Article!]!
      findArticleBuySlug (slug: String!): [Article]
      findArticleBuyTag (tag: String!): [Article]
      findArticleByID (articleID: Int!): Article         
      getAllTag: [Tag!]!
      getAllBookMarks (page: Int, limit: Int): [BookMark!]!
      getAllLikes (articleId: Int!): [Like]
      getArticleBookMarkCount (articleId: Int!): Count!
      getArticleLikesCount (articleId: Int!): Count!
      }

      type Mutation {
      register (name: String!, username: String!, password: String!, phone: String!, input: OptionalUserInput, role: UserRole!): Auth!
      login (phone: String!, captcha: String!, uuid: String!): Otp!
      verifyOtp (phone: String!, code: String!): Auth!
      removeUser (userID: Int!): User
      logOut: Response!
      setAvatar (file: Upload!): File!
      setArticleCover (articleID: Int!, cover: Upload!): File!
      removeAvatar: Response!
      changeRole (role: UserRole!, userID: Int!): Response!
      createArticle (input: createArticleInput!): Article!
      delArticleCover (id: Int!) : Response!
      removeArticle (id: Int!) : Response!
      updateArticle (articleID: Int!, title: String!, content: String!) : Response!
      addTag (articleID: Int!, title: String!): Response!
      editTag (tagID: Int!, title: String!): Response!
      removeTagArticle (articleID: Int!, tagID: Int!): Response!
      removeTagFromAdmin (tagID: Int!): Response!
      removeAllTag : Response!
      addBookMark (articleId: Int!): Response!
      removeBookMark (articleId: Int!): Response!
      addLike (articleId: Int!): Response!
      disLike (articleId: Int!): Response!
      }
`;
