import React, { useEffect, useState } from 'react';
import alanBtn from '@alan-ai/alan-sdk-web'
import wordsToNumbers from 'words-to-numbers'
import NewsCards from './components/NewsCards/NewsCards'
import useStyles from './styles';

const alanKey = 'c632b9477b52332e427fbb426572e7db2e956eca572e1d8b807a3e2338fdd0dc/stage'

const App = () => {
    const classes = useStyles();

    const [newsArticles, setNewsArticles] = useState([])
    const [activeArticle, setActiveArticle] = useState(-1)

    useEffect(() => {
        alanBtn({
            key: alanKey,
            onCommand: ({command, articles, number}) => {
                if(command === 'newHeadlines') {
                    setNewsArticles(articles)
                    setActiveArticle(-1)
                } else if(command === 'highlight') {
                     setActiveArticle((prevActiveArticle) => prevActiveArticle + 1)
                } else if(command === 'open') {
                    //console.log(number)
                    const parsedNumber = number.length > 2 ? wordsToNumbers((number), { fuzzy: true }) : number;
                    const article = articles[parsedNumber - 1];
                    
                    if (parsedNumber > 20) {
                        alanBtn().playText('Please try that again...');
                    } else if (article) {
                        window.open(article.url, '_blank');
                        alanBtn().playText('Opening...');
                    } else {
                        alanBtn().playText('Please try that again...');
                    }
               }
            }
        })
    }, [])

    return (
        <div>
            <div className={classes.logoContainer}>
                <img  src="https://storage.googleapis.com/dev-dot-ai-project-ic.appspot.com/1/2020/05/960x0.jpg" className={classes.logo} />
            </div>
            <NewsCards articles={newsArticles} activeArticle={activeArticle} />
        </div>
    )
}


export default App



