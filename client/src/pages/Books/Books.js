import React, { Component } from "react";
import Jumbotron from "../../components/Jumbotron";
import DeleteBtn from "../../components/DeleteBtn";
import API from "../../utils/API";
import { Col, Row, Container } from "../../components/Grid";
import { List, ListItem } from "../../components/List";
import { Input, TextArea, FormBtn } from "../../components/Form";

class Books extends Component {
  state = {
    books: [],
    title: "",
    author: "",
    synopsis: ""
  };

  handleSubmit = event => {
    // When the form is submitted, prevent its default behavior, get recipes update the recipes state
    event.preventDefault();
    console.log(this.state.title, this.state.author, this.state.synopsis);

    const newBook = {
      title: this.state.title, 
      author: this.state.author, 
      synopsis: this.state.synopsis 
    };

    console.log("New Book:", newBook)

    API.saveBook(newBook)
      .then( this.loadBooks())
  };

  handleInputChange = event => {
    // Destructure the name and value properties off of event.target
    // Update the appropriate state
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  };

  componentDidMount() {
    this.loadBooks();
  }

  loadBooks = () => {
    API.getBooks()
      .then(res =>
        this.setState({ books: res.data, title: "", author: "", synopsis: "" })
      )
      .catch(err => console.log(err));
  };

  deleteBook = (event) => {
    
    const deleteId = event.target.id;
    API.deleteBook(deleteId)
      .then( this.loadBooks() );
  }

  render() {
    return (
      <Container fluid>
        <Row>
          <Col size="md-6">
            <Jumbotron>
              <h1>What Books Should I Read?</h1>
            </Jumbotron>
            <form>
              <Input name="title" value={this.state.title} placeholder="Title (required)" onChange={this.handleInputChange}/>
              <Input name="author" value={this.state.author} placeholder="Author (required)" onChange={this.handleInputChange}/>
              <TextArea name="synopsis" value={this.state.synopsis} placeholder="Synopsis (Optional)" onChange={this.handleInputChange}/>
              <FormBtn onClick={this.handleSubmit}>Submit Book</FormBtn>
            </form>
          </Col>
          <Col size="md-6">
            <Jumbotron>
              <h1>Books On My List</h1>
            </Jumbotron>
            {this.state.books.length ? (
              <List>
                {this.state.books.map(book => {
                  return (
                    <ListItem key={book._id}>
                      <a href={"/books/" + book._id}>
                        <strong>
                          {book.title} by {book.author}
                        </strong>
                      </a>
                      <DeleteBtn id={book._id} onClick={this.deleteBook}/>
                    </ListItem>
                  );
                })}
              </List>
            ) : (
              <h3>No Results to Display</h3>
            )}
          </Col>
        </Row>
      </Container>
    );
  }
}

export default Books;
