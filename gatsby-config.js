module.exports = {
  siteMetadata: {
    siteUrl: "https://awesome-conferences.github.io/list/",
    title: "Conferences",
  },
  plugins: [
    "gatsby-transformer-remark",
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "pages",
        path: "./src/pages/",
      },
      __key: "pages",
    },
    {
      resolve: 'gatsby-plugin-web-font-loader',
      options: {
        google: {
          families: ['Roboto', 'Material Icons']
        }
      }
    },
  ],
  pathPrefix: "/list",

};
