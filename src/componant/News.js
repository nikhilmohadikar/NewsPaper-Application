import React, { Component } from 'react'
import NewsItem from './NewsItem'
import PropTypes from 'prop-types'
import InfiniteScroll from "react-infinite-scroll-component";

export class News extends Component {
    // articles = [
    //     {
    //         "source": {
    //             "id": "the-wall-street-journal",
    //             "name": "The Wall Street Journal"
    //         },
    //         "author": "wsj",
    //         "title": "U.S. Spy Agencies Buy Vast Quantities of Americans' Personal Data...",
    //         "description": "Commercially available data from cars, phones and web browsers rivals results from wiretaps, cyber espionage and physical surveillance",
    //         "url": "https://www.wsj.com/articles/u-s-spy-agencies-buy-vast-quantities-of-americans-personal-data-report-says-f47ec3ad",
    //         "urlToImage": "https://images.wsj.net/im-798772/social",
    //         "publishedAt": "2023-06-12T19:00:04Z",
    //         "content": "U.S. Spy Agencies Buy Vast Quantities of Americans’ Personal Data, U.S. Says\r\nWASHINGTON—The vast quantities of Americans’ personal data available for sale have provided a rich stream of intelligence… [+835 chars]"
    //     },
    //     {
    //         "source": {
    //             "id": "the-wall-street-journal",
    //             "name": "The Wall Street Journal"
    //         },
    //         "author": "hirundo",
    //         "title": "The moral hazards of being beautiful",
    //         "description": "Article URL: https://www.wsj.com/articles/the-moral-hazards-of-being-beautiful-94346e61\nComments URL: https://news.ycombinator.com/item?id=36293286\nPoints: 5\n# Comments: 1",
    //         "url": "https://www.wsj.com/articles/the-moral-hazards-of-being-beautiful-94346e61",
    //         "urlToImage": "https://images.wsj.net/im-793989/social",
    //         "publishedAt": "2023-06-12T13:42:30Z",
    //         "content": "Beauty has its privileges. Studies reliably show that the most physically attractive among us tend to get more attention from parents, better grades in school, more money at work and more satisfactio… [+355 chars]"
    //     }
    // ]

    // static defaultProps = {
    //     name : 'in',
    //     pageSize : 8,
    //     category : 'general'
    // }

    static propTypes = {
        country: PropTypes.string,
        pageSize: PropTypes.number,
        category: PropTypes.string,
    }

    CapitaliseFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    constructor(props) {
        super(props);
        this.state = {
            articles: [],
            loading: false,
            page: 1,
            totalResults: 0
        }
        document.title = `${this.CapitaliseFirstLetter(this.props.category)} - News Application`
    }


    async UpdateNews() {
        this.props.setProgress(10);
        const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=e067a3eaee7e4e0a90dfcbfd951f57c8&page=${this.state.page}&pageSize=${this.props.pageSize}`
        this.setState({ loading: true })
        let data = await fetch(url);
        this.props.setProgress(30);
        let parsedData = await data.json();
        this.props.setProgress(60);
        this.setState({
            articles: parsedData.articles,
            totalResults: parsedData.totalResults,
            loading: false,
        })
        this.props.setProgress(100);
    }

    async componentDidMount() {
        this.UpdateNews();
    }

    handlePrevClick = async () => {
        this.setState({ page: this.page - 1 })
        this.UpdateNews();
    }

    handleNextClick = async () => {
        this.setState({ page: this.page - 1 })
        this.UpdateNews();
    }

    fetchMoreData = async () => {
        this.setState({ page: this.state.page + 1 })
        // const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${this.props.apiKey}&page=${this.state.page}&pageSize=${this.props.pageSize}`
        const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=e067a3eaee7e4e0a90dfcbfd951f57c8&page=${this.state.page}&pageSize=${this.props.pageSize}`
        let data = await fetch(url);
        let parsedData = await data.json();
        this.setState({
            articles: this.state.articles.concat(parsedData.articles),
            totalResults: parsedData.totalResults
        })
    };

    render() {
        return (
            <>
                <h1 className="text-center" style={{ margin: "35px 0px" }}>News Application - Top {this.CapitaliseFirstLetter(this.props.category)} Headlines</h1>
                <InfiniteScroll
                    dataLength={this.state.articles.length}
                    next={this.fetchMoreData}
                    hasMore={this.state.articles.length !== this.state.totalResults}
                >
                    <div className="container my-3">
                        <div className="row">
                            {this.state.articles.map((element) => {
                                return <div className="col-md-4" key={element.url} >
                                    <NewsItem title={element.title ? element.title : ""} description={element.description ? element.description.slice(0, 88) : ""} 
                                    imageUrl={element.urlToImage ? element.urlToImage : "https://images.hindustantimes.com/tech/img/2023/06/22/1600x900/Google_Pixel_ad_1687424110772_1687424116170.png"} 
                                    newsUrl={element.url} author={element.author} date={element.publishedAt} source={element.source.name} />
                                </div>
                            })}
                        </div>
                    </div>
                </InfiniteScroll>
            </>
        )
    }
}

export default News

