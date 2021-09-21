import React, { Component } from "react";
import * as JsSearch from "js-search";
import { conferences } from "../../static/conferences.yaml";
class Search extends Component {
  state = {
    confList: conferences,
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
      <div>
        <div>
          <form onSubmit={this.handleSubmit}>
            <div>
              <label htmlFor="Search" style={{ paddingRight: "10px" }}>
                Search:
              </label>
              <input
                id="Search"
                value={searchQuery}
                onChange={this.searchData}
                placeholder=""
                style={{ margin: "0 auto", width: "400px" }}
              />
            </div>
          </form>
          <div>
            <table>
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
                      <td>{item.topics}</td>
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
            </table>
          </div>
        </div>
      </div>
    );
  }
}
export default Search;
