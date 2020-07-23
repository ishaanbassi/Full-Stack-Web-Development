import React, { Component } from 'react';
import { Navbar, NavbarBrand } from 'reactstrap';
import Menu from './MenuComponent';
import DishDetail from './DishdetailComponent';
import { DISHES } from '../shared/dishes';
import Header from './HeaderComponent';
import Footer from './FooterComponent';
import Home from './HomeComponent';
import { Switch, Route, Redirect, withRouter } from 'react-router-dom';
import Contact from './ContactComponent';
import { COMMENTS } from '../shared/comments';
import { PROMOTIONS } from '../shared/promotions';
import { LEADERS } from '../shared/leaders';
import About from './AboutComponent';
import { connect } from 'react-redux';
import { actions } from 'react-redux-form';
import { postFeedback,fetchLeaders, postComment, fetchDishes, fetchComments, fetchPromos } from '../redux/ActionCreators';
import { TransitionGroup, CSSTransition } from 'react-transition-group';



const mapStateToProps = state => {
  return {
    dishes: state.dishes,
    comments: state.comments,
    promotions: state.promotions,
    leaders: state.leaders
  }
}
const mapDispatchToProps = dispatch => ({
      
  fetchDishes: () => { dispatch(fetchDishes())},
  resetFeedbackForm: () => { dispatch(actions.reset('feedback'))},
  fetchComments: () => dispatch(fetchComments()),
  fetchPromos: () => dispatch(fetchPromos()),
  fetchLeaders: () => dispatch(fetchLeaders()),
  postComment: (dishId, rating, author, comment) => dispatch(postComment(dishId, rating, author, comment)),
  postFeedback: (first, last, telnum, email, agree, contactType, message) => dispatch(postFeedback(first, last, telnum, email, agree, contactType, message))
  });


class Main extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
        dishes: DISHES,
        comments: COMMENTS,
        promotions: PROMOTIONS,
        leaders: LEADERS
    };
  }

  componentDidMount() {
    this.props.fetchDishes();
    this.props.fetchComments();
    this.props.fetchPromos();
    this.props.fetchLeaders();
  }
  


  onDishSelect(dishId) {
    this.setState({ selectedDish: dishId});
  }


  render() {

    const HomePage = () => {
      
      return(
          <Home 
              dish={this.props.dishes.dishes.filter((dish) => dish.featured)[0]}
              dishesLoading={this.props.dishes.isLoading}
              dishErrMess={this.props.dishes.errMess}
              promotion={this.props.promotions.promotions.filter((promo) => promo.featured)[0]}
              promoLoading={this.props.promotions.isLoading}
              promoErrMess={this.props.promotions.errMess}
              leadersLoading={this.props.leaders.isLoading}
              leadersErrMess={this.props.leaders.errMess}
              leader={this.props.leaders.leaders.filter((leader) => leader.featured)[0]}
          />
      );
    }
    const AboutPage = () => {
      return(
        <About leaders={this.props.leaders.leaders} 
            leadersLoading={this.props.leaders.isLoading}
            leadersErrMess={this.props.leaders.errMess}/>

      );
    }

    const DishWithId = ({match}) => {
      return(
          <DishDetail dish={this.props.dishes.dishes.filter((dish) => dish.id === parseInt(match.params.dishId,10))[0]}
            isLoading={this.props.dishes.isLoading}
            errMess={this.props.dishes.errMess}
            comments={this.props.comments.comments.filter((comment) => comment.dishId === parseInt(match.params.dishId,10))}
            commentsErrMess={this.props.comments.errMess}
            postComment={this.props.postComment}
          />
      );
    };
    const ContactPage = () => {
      return(
        <Contact resetFeedbackForm={this.props.resetFeedbackForm}
            postFeedback = {this.props.postFeedback}
        />
      );
    }

    return (
      <div>
        <Header />
        <TransitionGroup>
          <CSSTransition key={this.props.location.key} classNames="page" timeout={300}>
            <Switch location={this.props.location}>
              <Route path='/home' component={HomePage} />
              <Route path='/aboutus' component={AboutPage} />
              <Route exact path='/menu' component={() => <Menu dishes={this.props.dishes} />} />
              <Route path='/menu/:dishId' component={DishWithId} />
              <Route exact path='/contactus' component={ContactPage} />
              <Redirect to="/home" />
            </Switch>
          </CSSTransition>
        </TransitionGroup>
        
        <Footer />
      </div>
    );
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Main));

// <Navbar dark color="primary">
//           <div className="container">
//             <NavbarBrand href="/">Ristorante Con Fusion</NavbarBrand>
//           </div>
//         </Navbar>