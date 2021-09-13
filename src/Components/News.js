import React, { Component } from 'react'
import NewsItem from './NewsItem'
import Spinner from './Spinner'
import InfiniteScroll from "react-infinite-scroll-component";

export class News extends Component {

    captilize = (word) => {
        return word.slice(0, 1).toUpperCase() + word.slice(1)
    }
    constructor(props) {
        super(props)
        this.state = {
            articles: [],
            loading: false,
            page: 1,
            totalResults:0
        }
        document.title = this.captilize(this.props.category)
    }



    async updateNews() {
        this.props.setProgress(10);
        const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${this.props.apiKey}&page=${this.state.page}&pageSize=${this.props.pageSize}`
        this.setState({ loading: true })
        let data = await fetch(url)
        let parseData = await data.json()
        this.setState({ articles: parseData.articles, totalResults: parseData.totalResults, loading: false })
        this.props.setProgress(100);
    }

    async componentDidMount() {
        this.updateNews()
    }

    handlePrevClick = async () => {
        this.setState({ page: this.state.page - 1 })
        this.updateNews()
    }

    handleNextClick = async () => {

        this.setState({ page: this.state.page + 1 })
        this.updateNews()
    }

    fetchMoreData = async() => {
        this.setState({ page: this.state.page + 1 })
        const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${this.props.apiKey}&page=${this.state.page}&pageSize=${this.props.pageSize}`
        // this.setState({ loading: true })
        let data = await fetch(url)
        let parseData = await data.json()
        this.setState({ articles: this.state.articles.concat(parseData.articles), totalResults: parseData.totalResults })
      }
    render() {
        return (
            <>

                <>
                    <h1 className="text-center">NewsPlane-Top {this.captilize(this.props.category)} Headlines</h1>
                    { this.state.loading && <Spinner/> } 

                    <InfiniteScroll
                        dataLength={this.state.articles.length}
                        next={this.fetchMoreData}
                        hasMore={this.state.articles.length!== this.state.totalResults}
                        loader={<Spinner/>}
                    >
                     <div className="container">
                     <div className="row ">
                        {this.state.articles.map((element) => {
                            return <div className="col md-4" key={element.url}>
                                <NewsItem title={element.title ? element.title : ""} description={element.description ? element.description : ""} imageurl={element.urlToImage} newsurl={element.url} author={element.author} date={element.publishedAt} />
                            </div>
                        })}

                    </div>
                     </div>
                    </InfiniteScroll>
                </>
                {/* <div className="container d-flex justify-content-between">
                    <button disabled={this.state.page <= 1} type="button" onClick={this.handlePrevClick} className="btn btn-dark">&larr; Previous</button>
                    <button disbaled={this.state.page + 1 > Math.ceil(this.state.totalResults / this.props.pageSize)} type="button" onClick={this.handleNextClick} className="btn btn-dark">Next &rarr;</button>
                </div> */}
            </>
        )
    }
}

export default News
