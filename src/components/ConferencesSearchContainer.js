import React, { Component } from "react";
import * as JsSearch from "js-search";
import conferences from "../../static/conferences.yaml";
import { Input, Form, Tag, Table, Layout, Row, Col } from "antd";
import "antd/dist/antd.css";

const { Header, Content } = Layout;
const randomColor = (string) => {
  var sanitized = string.replace(/[^A-Za-z]/, "");
  var letters = sanitized.split("");

  //Determine the hue
  var hue = Math.floor(
    ((letters[0].toLowerCase().charCodeAt() - 96) / 26) * 360
  );
  var ord = "";
  for (var i in letters) {
    ord = letters[i].charCodeAt();
    if ((ord >= 65 && ord <= 90) || (ord >= 97 && ord <= 122)) {
      hue += ord - 64;
    }
  }

  hue = hue % 360;

  //Determine the saturation
  var vowels = ["A", "a", "E", "e", "I", "i", "O", "o", "U", "u"];
  var count_cons = 0;

  //Count the consonants
  for (i in letters) {
    if (vowels.indexOf(letters[i]) === -1) {
      count_cons++;
    }
  }

  //Determine what percentage of the string is consonants and weight to 95% being fully saturated.
  var saturation = (count_cons / letters.length / 0.95) * 100;
  if (saturation > 100) saturation = 100;

  //Determine the luminosity
  var ascenders = ["t", "d", "b", "l", "f", "h", "k"];
  var descenders = ["q", "y", "p", "g", "j"];
  var luminosity = 50;
  var increment = (1 / letters.length) * 50;

  for (i in letters) {
    if (ascenders.indexOf(letters[i]) !== -1) {
      luminosity += increment;
    } else if (descenders.indexOf(letters[i]) !== -1) {
      luminosity -= increment * 2;
    }
  }
  if (luminosity > 100) luminosity = 100;
  return `hsl(${hue},${saturation}%,${luminosity}%)`;
};

const colors = Object.fromEntries(
  new Map(
    [...new Set(conferences.conferences.flatMap((item) => item.topics))].map(
      (item) => [item, randomColor(item)]
    )
  )
);

const topics = [
  ...new Set(conferences.conferences.flatMap((item) => item.topics)),
];
const formats = [
  ...new Set(conferences.conferences.map((item) => item.format)),
];

const columns = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    render: (text, record) => <a href={record.url}>{text}</a>,
    sorter: {
      compare: (a, b) => new Intl.Collator().compare(a.name, b.name),
      sortDirections: ["ascend", "descend"],
    },
  },
  {
    title: "Start date",
    dataIndex: "date_start",
    key: "date_start",
  },
  {
    title: "End date",
    dataIndex: "date_end",
    key: "date_end",
  },
  {
    title: "Price",
    dataIndex: "price",
    key: "price",
    render: (text, record) => <span>{`${record.currency} ${text}`}</span>,
  },
  {
    title: "Format",
    dataIndex: "format",
    key: "format",
    filters: formats.map((it) => {
      return { text: it, value: it };
    }),
    onFilter: (value, record) => {
      return record.format === value;
    },
    sorter: {
      compare: (a, b) => new Intl.Collator().compare(a.format, b.format),
      sortDirections: ["ascend", "descend"],
    },
  },
  {
    title: "CFP deadline",
    dataIndex: "cfp_deadline",
    key: "cfp_deadline",
  },
  {
    title: "Topics",
    dataIndex: "topics",
    key: "topics",
    render: (tags) => (
      <>
        {tags.map((tag) => {
          let color = colors[tag];
          return (
            <Tag color={color} key={tag}>
              {tag.toUpperCase()}
            </Tag>
          );
        })}
      </>
    ),
    filters: topics.map((it) => {
      return { text: it, value: it };
    }),
    onFilter: (value, record) => {
      return record.topics.indexOf(value) !== -1;
    },
  },
];

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
        <Content style={{ padding: "0 50px" }}>
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
          <Row>
            <Col span={24}>
              <Table columns={columns} dataSource={queryResults} />
            </Col>
          </Row>
        </Content>
      </Layout>
    );
  }
}
export default Search;
