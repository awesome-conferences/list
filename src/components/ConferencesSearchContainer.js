import React, { Component } from "react";
import * as JsSearch from "js-search";
import conferences from "../../static/conferences.yaml";
import { Input, Form, Tag, Table, Layout, Row, Col } from 'antd';
import 'antd/dist/antd.css';


const { Header, Content } = Layout;

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    render: (text, record)=>(
      <a href={record.url}>{text}</a>
    )
  },
  {
    title: 'Start date',
    dataIndex: 'date_start',
    key: 'date_start',
  },
  {
    title: 'End date',
    dataIndex: 'date_end',
    key: 'date_end',
  },
  {
    title: 'Price',
    dataIndex: 'price',
    key: 'price',
    render: (text, record)=>(
      <span>{`${record.currency} ${text}`}</span>
    )
 },
  {
    title: 'Format',
    dataIndex: 'format',
    key: 'format',
  },
  {
    title: 'CFP deadline',
    dataIndex: 'cfp_deadline',
    key: 'cfp_deadline',
  },
  {
    title: 'Topics',
    dataIndex: 'topics',
    key: 'topics',
    render: tags => (
      <>
        {tags.map(tag => {
          let color = tag.length > 5 ? 'geekblue' : 'green';
          return (
            <Tag color={color} key={tag}>
              {tag.toUpperCase()}
            </Tag>
          );
        })}
      </>
    ),},
]

class Search extends Component {
  state = {
    confList: conferences.conferences,
    search: [],
    searchResults: [],
    isLoading: true,
    isError: false,
    searchQuery: "",
  };

  async componentDidMount() {
    this.rebuildIndex();
  }

  /**
   * rebuilds the overall index based on the options
   */
  rebuildIndex = () => {
    const { confList } = this.state;
    const dataToSearch = new JsSearch.Search("url");
    dataToSearch.indexStrategy = new JsSearch.PrefixIndexStrategy();
    dataToSearch.sanitizer = new JsSearch.LowerCaseSanitizer();

    dataToSearch.searchIndex = new JsSearch.TfIdfSearchIndex("url");

    // searching by these fields only:
    dataToSearch.addIndex("name");
    dataToSearch.addIndex("date_start");
    dataToSearch.addIndex("date_end");
    dataToSearch.addIndex("topics");

    dataToSearch.addDocuments(confList); // adds the data to be searched
    this.setState({ search: dataToSearch, isLoading: false });
  };

  /**
   * handles the input change and perform a search with js-search
   * in which the results will be added to the state
   */
  searchData = (e) => {
    const { search } = this.state;
    const queryResult = search.search(e.target.value);
    this.setState({ searchQuery: e.target.value, searchResults: queryResult });
  };
  handleSubmit = (e) => {
    e.preventDefault();
  };

  render() {
    const { confList, searchResults, searchQuery } = this.state;
    const queryResults = searchQuery === "" ? confList : searchResults;
    return (
      <Layout className="layout">
        <Header>
          <h1>Hi!</h1>
        </Header>
        <Content style={{padding: '0 50px'}}>
          <Row>
            <Col span={24}>
            <Form onSubmit={this.handleSubmit}>
              <Input
                id="Search:"
                value={searchQuery}
                onChange={this.searchData}
                placeholder="Search"
                style={{ margin: "0 auto", width: "400px" }}
              />
          </Form>
            </Col>
            </Row>
            {/* <table>
              <thead>
                <tr>
                  <th>Conference</th>
                  <th>Topic</th>
                  <th>Price</th>
                  <th>Dates</th>
                  <th>Format</th>
                </tr>
              </thead>
              <tbody>
                {queryResults.map((item) => {
                  return (
                    <tr key={`row_${item.url}`}>
                      <td>
                        <a href={item.url}>{item.name}</a>
                      </td>
                      <td>{item.topics.join(", ")}</td>
                      <td>
                        {item.currency} {item.price}
                      </td>
                      <td>
                        {item.date_start} — {item.date_end}
                      </td>
                      <td>{item.format}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table> */}
            <Row>
              <Col span={24}><Table columns={columns} dataSource={queryResults}/></Col>
            </Row>
        </Content>
      </Layout>
    );
  }
}
export default Search;
