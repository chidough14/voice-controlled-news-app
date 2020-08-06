import React, {useState, useEffect, createRef} from 'react';
import {Card, CardActions, CardActionArea, CardContent, CardMedia, Button, Typography} from '@material-ui/core'
import useStyles from './styles.js'
import classNames from 'classnames'

const NewsCard = ({article: {description, publishedAt, url, urlToImage, source, title}, i, activeArticle}) => {

    const classes = useStyles()
    const [elRefs, setElRefs] = useState([])
    const scrollToRef = (ref)=> window.scroll(0, ref.current.offsetTop - 50)


    useEffect(() => {
        setElRefs((refs)=> Array(20).fill().map((_, j)=> refs[j] || createRef()))
    }, [])

    useEffect(() => {
       if(i === activeArticle && elRefs[activeArticle]) {
           scrollToRef(elRefs[activeArticle])
       }
    }, [i, activeArticle, elRefs])

    return (
        <Card ref={elRefs[i]} className={classNames(classes.card, activeArticle === i ? classes.activeCard : null)}>
            <CardActionArea href={url} target="_blank">
                <CardMedia className={classes.media} image={urlToImage || 'https://img.icons8.com/cute-clipart/128/000000/news.png'}/>
                <div className={classes.details}>
                    <Typography variant="body2" component="h2" color="textSecondary">{(new Date(publishedAt)).toDateString()}</Typography>
                    <Typography variant="body2" component="h2" color="textSecondary">{source.name}</Typography>
                </div>
                <Typography variant="h5" gutterBottom className={classes.title}>{title}</Typography>
                <CardContent>
                <    Typography variant="body2" component="p" color="textSecondary">{description}</Typography>
                </CardContent>
            </CardActionArea>

            <CardActions className={classes.cardActions}>
                <Button size="small" color="primary">Learn More</Button>
                <Typography variant="h5"color="textSecondary">{i + 1}</Typography>
            </CardActions>
        </Card>
    )
}


export default NewsCard