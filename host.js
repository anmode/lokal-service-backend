const fetch = require('node-fetch');
// async function getArticleTitles(author) {
//     const baseUrl = 'https://jsonmock.hackerrank.com/api/articles';
//     const titles = [];
  
//     const processData = (responseData, targetAuthor) => {
//       responseData.data.forEach(article => {
//         if (article.author === targetAuthor) {
//           if (article.title) {
//             titles.push(article.title);
//           } else if (article.story_title) {
//             titles.push(article.story_title);
//           }
//         }
//       });
//     };
  
//     const firstPageResponse = await fetch(baseUrl);
//     const firstPageData = await firstPageResponse.json();
//     const totalPages = firstPageData.total_pages;
//     processData(firstPageData, author);
  
//     const requests = [];
//     for (let page = 2; page <= totalPages; page++) {
//       requests.push(fetch(`${baseUrl}?page=${page}`).then(res => res.json()));
//     }
  
//     const results = await Promise.all(requests);
//     results.forEach(pageData => {
//       processData(pageData, author);
//     });
  
//     return titles;
//   }
  
//   getArticleTitles('mpweiher')
//     .then(titles => {
//       console.log('Article Titles for saintamh:', titles);
//     })
//     .catch(error => {
//       console.error('Error fetching article titles:', error);
//     });
  

async function getAllArticles (){
    const tag = await fetch('https://jsonmock.hackerrank.com/api/articles');
    const data = await tag.json();
    console.log(data);

}

getAllArticles();

Array.isArray();