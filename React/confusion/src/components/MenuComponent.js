import React, { Component } from 'react';
import { Media } from 'reactstrap';
import { Card, CardImg, CardImgOverlay,
    CardTitle, Breadcrumb, BreadcrumbItem } from 'reactstrap';
import DishDetail from './DishdetailComponent.js';
import { Link } from 'react-router-dom';
import { Loading } from './LoadingComponent';
import { baseUrl } from '../shared/baseUrl';



function RenderMenuItem ({dish, onClick}) {
    return (
        <Card>
          <Link to={`/menu/${dish.id}`} >
            <CardImg width="100%" src={baseUrl+dish.image} alt={dish.name} />
            <CardImgOverlay>
                <CardTitle>{dish.name}</CardTitle>
            </CardImgOverlay>
          </Link>
        </Card>
    );
}
//onClick={() => onClick(dish.id)}>
const Menu = (props) => {


    const menu = props.dishes.dishes.map((dish) => {
        return (
            <div className="col-12 col-md-5 m-1"  key={dish.id}>
                <RenderMenuItem dish={dish} onClick={props.onClick} />
            </div>
        );
    });
    if (props.dishes.isLoading) {
            return(
                <div className="container">
                    <div className="row">            
                        <Loading />
                    </div>
                </div>
            );
        }
    else if (props.dishes.errMess) {
        return(
            <div className="container">
                <div className="row"> 
                    <div className="col-12">
                        <h4>{props.dishes.errMess}</h4>
                    </div>
                </div>
            </div>
        );
    }
    else {
        return (

            <div className="container">
                <div className="row">
                    <Breadcrumb>
                        <BreadcrumbItem><Link to="/home">Home</Link></BreadcrumbItem>
                        <BreadcrumbItem active>Menu</BreadcrumbItem>
                    </Breadcrumb>
                    <div className="col-12">
                        <h3>Menu</h3>
                        <hr />
                    </div>                
                </div>
                <div className="row">
                    {menu}
                </div>
            </div>  
        );
    }
    
}

export default Menu;

// class Menu extends Component {
    // constructor(props) {
        // super(props);

        // this.state = {
        //     selectedDish: null
        // }
    // }

    // onDishSelect(dish) {
    //     this.setState({ selectedDish: dish});
    // }

    // renderDish(dish) {
    //     if (dish != null)
    //         return(
    //             <Card>
    //                 <CardImg top src={dish.image} alt={dish.name} />
    //                 <CardBody>
    //                   <CardTitle>{dish.name}</CardTitle>
    //                   <CardText>{dish.description}</CardText>
    //                 </CardBody>
    //             </Card>
    //         );
    //     else
    //         return(
    //             <div></div>
    //         );
    // }

//     render() {
//         const menu = this.props.dishes.map((dish) => {
//             return (
//               <div  className="col-12 col-md-5 m-1">
//                 <Card key={dish.id}
//                   onClick = {() => this.props.onClick(dish.id)}>
//                   <CardImg width="100%" src={dish.image} alt={dish.name} />
//                   <CardImgOverlay>
//                       <CardTitle>{dish.name}</CardTitle>
//                   </CardImgOverlay>
//                 </Card>
//               </div>
//             );
//         });

//         return ( 
//             <div className="container">
//                 <div className="row">
//                     {menu}
//                 </div>
//                 <div className="row">
//                   <DishDetail dish = {this.state.selectedDish}/>
//                 </div>
//             </div>
//         );
//     }
// }

// export default Menu;



