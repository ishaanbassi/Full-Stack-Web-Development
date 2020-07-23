import React, { Component } from 'react';
import { Media } from 'reactstrap';
import { Card, CardImg, CardText, CardBody,
    CardTitle, Breadcrumb, BreadcrumbItem, Button, Modal, ModalHeader, ModalBody, Form, FormGroup, Label, Input, Row, Col } from 'reactstrap';
import { Link } from 'react-router-dom';
import { Control, LocalForm, Errors } from 'react-redux-form';
import { Loading } from './LoadingComponent';
import { baseUrl } from '../shared/baseUrl';
import { FadeTransform, Fade, Stagger } from 'react-animation-components';




class CommentForm extends React.Component {
  constructor(props) {
    super(props);
    
    this.toggleModal = this.toggleModal.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = {
      rating: '',
      name: '',
      comment: '',
      isModalOpen: false,
      touched: {
        rating: '',
        name: '',
        comment: '',
      }
    };  
  }
  toggleModal() {
    this.setState({
      isModalOpen: !this.state.isModalOpen
    });
  }
  handleSubmit(values) {
        this.toggleModal();
        console.log('Current State is: ' + JSON.stringify(values));
        alert('Current State is: ' + JSON.stringify(values));
        this.props.postComment(this.props.dishId, values.rating, values.author, values.comment);

        // event.preventDefault();
    }
  render() {
    const required = (val) => val && val.length;
    const maxLength = (len) => (val) => !(val) || (val.length <= len);
    const minLength = (len) => (val) => val && (val.length >= len); 
    return (
      <div>
        <Button onClick={this.toggleModal} id="submitcomment"><div className="fa fa-pencil"/> Submit Comment</Button>
        <Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal}>
          <ModalHeader toggle={this.toggleModal}>Login</ModalHeader>
          <ModalBody>
            <LocalForm onSubmit={(values) => this.handleSubmit(values)}>
                <Row className="form-group">
                    <Label htmlFor="rating" md={2}>Rating</Label>
                    <Col md={10}>
                        <Control.select model=".rating" id="rating" name="rating"
                          placeholder="" className="form-control">
                          <option>1</option>
                          <option>2</option>
                          <option>3</option>
                          <option>4</option>
                          <option>5</option>
                        </Control.select>
                    </Col>
                </Row>
                <Row className="form-group">
                    <Label htmlFor="name" md={2}>Name</Label>
                    <Col md={10}>
                        <Control.text model=".author" id="author" name="author"
                          placeholder="Your Name"
                          className="form-control"
                          validators={{
                            required, minLength: minLength(3), maxLength: maxLength(15)
                          }} 
                        />
                        <Errors
                          className="text-danger"
                          model=".name"
                          show="touched"
                          messages={{
                              required: 'Required',
                              minLength: 'Must be greater than 2 characters',
                              maxLength: 'Must be 15 characters or less'
                          }}
                        />
                    </Col>
                </Row>
                <Row className="form-group">
                    <Label htmlFor="comment" md={2}>Comment</Label>
                    <Col md={10}>
                        <Control.textarea rows="6" model=".comment" id="comment" name="comment"
                            placeholder="Comment"
                            className="form-control" />
                    </Col>
                </Row>
                <Row className="form-group">
                  <Col md={{size:10, offset: 2}}>
                      <Button type="submit" color="primary">
                        Submit
                      </Button>
                  </Col>
                </Row>
                
            </LocalForm>
          </ModalBody>
        </Modal>
      </div> 
    );
  }
}

function RenderDish({dish}) {
  return(
    <FadeTransform
      in
      transformProps={{
          exitTransform: 'scale(0.5) translateY(-50%)'
      }}>
        <Card>
            <CardImg top src={baseUrl + dish.image} alt={dish.name} />
            <CardBody>
              <CardTitle>{dish.name}</CardTitle>
              <CardText>{dish.description}</CardText>
            </CardBody>
        </Card>
     </FadeTransform>
  );   
}

function RenderComments({comments, postComment, dishId}) {
  
  const commentlist = comments.map((c) => {
    
    const date = new Date(c.date);
    var y = date.toLocaleString('default',{year : 'numeric'}); 
    var m = date.toLocaleString('default',{month : 'short'});
    var d = date.toLocaleString('default',{day : '2-digit'});

    return(
      <p><li>{c.comment}<br />-- {c.author}, {m} {d}, {y}</li></p>
    );

  });
  if(comments!=null)
  {
    return(
            <div>
              <h4>Comments</h4>
              <ul className="list-unstyled">
              <Stagger in>
                {comments.map((comment) => {
                    return (
                        <Fade in>
                        <li key={comment.id}>
                        <p>{comment.comment}</p>
                        <p>-- {comment.author} , {new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: '2-digit'}).format(new Date(Date.parse(comment.date)))}</p>
                        </li>
                        </Fade>
                    );
                })}
              </Stagger>
              </ul>
              <CommentForm dishId={dishId} postComment={postComment} />  
            </div>
        );
  }
  else
  {
      return(
        <div></div>
      );
  }
      
}

const  DishDetail = (props) => {
  if (props.isLoading) {
    return(
        <div className="container">
            <div className="row">            
                <Loading />
            </div>
        </div>
    );
  }
  else if (props.errMess) {
    return(
      <div className="container">
        <div className="row">            
            <h4>{props.errMess}</h4>
        </div>
      </div>
      );
  }
  if(props.dish!=null)
  { 
    return (
        <div className="container">
        <div className="row">
            <Breadcrumb>

                <BreadcrumbItem><Link to="/menu">Menu</Link></BreadcrumbItem>
                <BreadcrumbItem active>{props.dish.name}</BreadcrumbItem>
            </Breadcrumb>
            <div className="col-12">
                <h3>{props.dish.name}</h3>
                <hr />
            </div>                
        </div>
        <div className="row">
            <div className="col-12 col-md-5 m-1">
                <RenderDish dish={props.dish} />
            </div>
            <div className="col-12 col-md-5 m-1 text-left">
                <RenderComments comments={props.comments} 
                  postComment={props.postComment}
                  dishId={props.dish.id}/>
            </div>
        </div>
        </div>
    );
  }
  else{
    return(
      <div></div>
    );
  }
}
    
    


// class DishDetail extends Component {
//     constructor(props) {
//         super(props);


        
//     }
//     renderDish(dish) {
//       return(
//         <Card>
//             <CardImg top src={dish.image} alt={dish.name} />
//             <CardBody>
//               <CardTitle>{dish.name}</CardTitle>
//               <CardText>{dish.description}</CardText>
//             </CardBody>
//         </Card>
//       );      
//     }
//     renderComments(comments) {
//       const commentlist = comments.map((c) => {
        
//         const date = new Date(c.date);
//         var y = date.toLocaleString('default',{year : 'numeric'}); 
//         var m = date.toLocaleString('default',{month : 'short'});
//         var d = date.toLocaleString('default',{day : '2-digit'});

//         return(
//           <p><li>{c.comment}<br />-- {c.author}, {m} {d}, {y}</li></p>
//         );

//       });
//       if(comments!=null)
//       {
//         return(
//                 <div>
//                   <h4>Comments</h4>
//                   <ul className="list-unstyled">
//                   {commentlist}
//                   </ul>
//                 </div>
//             );
//       }
//       else
//       {
//           return(
//             <div></div>
//           );
//       }

//     }

//     render() {
//         // console.log(this.props.dish)
//         if(this.props.dish!=null)
//         {
//           return (
//               <div className="container">
//                   <div className="row">
//                     <div  className="col-12 col-md-5 m-1">
//                       {this.renderDish(this.props.dish)}
//                     </div>
//                     <div className="col-12 col-md-5 m-1 text-left">
//                       {this.renderComments(this.props.dish.comments)}
//                     </div>
                    
//                   </div>
//               </div>
//           );
//         }
//         else{
//           return(
//             <div></div>
//           );
//         }
//     }
// }

export default DishDetail;

// <div className="col-12 col-md-5 m-1">
//                     {this.renderComments(this.props.dish.comments)}
//                   </div>