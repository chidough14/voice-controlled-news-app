//Alan Studio Project Code

intent('What does this app do?', reply('This is a news app'))

//intent('Start a Command', (p) => {
//    p.play({command: 'testCommand'})
//})

const API_KEY = '9e05afd3d5a7439bb5a564a02df6c6d8'
let savedArticles = []

//News by source
intent('Give me the news from $(source* (.*))', (p) => {
    let NEWS_API_URL = `https://newsapi.org/v2/top-headlines?apiKey=${API_KEY}`
    
    if(p.source.value) {
        NEWS_API_URL = `${NEWS_API_URL}&sources=${p.source.value.toLowerCase().split(" ").join("-")}`
    }
    
    api.request(NEWS_API_URL, (error, response, body) => {
        const {articles} = JSON.parse(body)
        
        if(!articles.length) {
            p.play('Sorry, please try searching for news from a different source')
            return
        }
        
        savedArticles = articles
        p.play({command: 'newHeadlines', articles})
        p.play(`Here are the (latest|recent) ${p.source.value} news`)
        
        p.play("Would you like me to read the headlines")
        p.then(confirmation)
            
    })
})

//News by term
intent('What\'s up with $(term* (.*))', (p) => {
    let NEWS_API_URL = `https://newsapi.org/v2/everything?apiKey=${API_KEY}`
    
    if(p.term.value) {
        NEWS_API_URL = `${NEWS_API_URL}&q=${p.term.value}`
    }
    
    api.request(NEWS_API_URL, (error, response, body) => {
        const {articles} = JSON.parse(body)
        
        if(!articles.length) {
            p.play('Sorry, please try searching for something else')
            return
        }
        
        savedArticles = articles
        p.play({command: 'newHeadlines', articles})
        p.play(`Here are the (latest|recent) articles on ${p.term.value}`)
        
        p.play("Would you like me to read the headlines")
        p.then(confirmation)
             
    })
})



// News by Categories
const CATEGORIES = ['business', 'entertainment', 'general', 'health', 'science', 'sports', 'technology'];
const CATEGORIES_INTENT = `${CATEGORIES.map((category) => `${category}~${category}`).join('|')}|`;

intent(`(show|what is|tell me|what's|what are|what're|read) (the|) (recent|latest|) $(N news|headlines) (in|about|on|) $(C~ ${CATEGORIES_INTENT})`,
  `(read|show|get|bring me|give me) (the|) (recent|latest) $(C~ ${CATEGORIES_INTENT}) $(N news|headlines)`, (p) => {
    let NEWS_API_URL = `https://newsapi.org/v2/top-headlines?apiKey=${API_KEY}&country=us`;
    
    if(p.C.value) {
        NEWS_API_URL = `${NEWS_API_URL}&category=${p.C.value}`
    }
    
   api.request(NEWS_API_URL, (error, response, body) => {
        const {articles} = JSON.parse(body)
        
        if(!articles.length) {
            p.play('Sorry, please try searching for a different category')
            return
        }
        
        savedArticles = articles
        p.play({command: 'newHeadlines', articles})
        
        if(p.C.value) {
            p.play(`Here are the (latest|recent) articles on ${p.C.value}`)
        } else {
            p.play(`Here are the (latest|recent) news`)
        }
          
       p.play("Would you like me to read the headlines")
       p.then(confirmation)
            
    })
})

const confirmation = context(()=> {
    intent('yes', async (p) => {
        for(let i=0; i<savedArticles.length; i++) {
            p.play({command: 'highlight', article: savedArticles[i]})
            p.play(`${savedArticles[i].title}`)
        }
    })
    
    intent('no', async (p) => {
            p.play("Sure, sound good to me")
    })
})

intent('open (the|) (article|) (number|) $(number* (.*))', (p) => {
    if(p.number.value) {
        p.play({command: 'open', number: p.number.value, articles: savedArticles})
    }
})

intent('(go|) back', (p) => {
    p.play("Going back")
    p.play({command: 'newHeadlines', articles: []})
})
