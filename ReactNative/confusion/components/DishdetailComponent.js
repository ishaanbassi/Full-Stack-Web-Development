import React, {Component} from 'react';
import { Text, View, ScrollView, FlatList, Modal, StyleSheet, Button, Alert, PanResponder, Share } from 'react-native';
import { COMMENTS } from '../shared/comments';
import { Card,Icon } from 'react-native-elements';
import { DISHES } from '../shared/dishes';
import { connect } from 'react-redux';
import { baseUrl } from '../shared/baseUrl';
import { postFavorite,postComment } from '../redux/ActionCreators';
import { Rating, Input } from 'react-native-elements';
import * as Animatable from 'react-native-animatable';




const mapStateToProps = state => {
    return {
        dishes: state.dishes,
        comments: state.comments,
        favorites: state.favorites
    }
  }

const mapDispatchToProps = dispatch => ({
    postFavorite: (dishId) => dispatch(postFavorite(dishId)),
    postComment: (dishId,author,rating,comment) => dispatch(postComment(dishId,author,rating,comment))
})

function RenderComments(props) {

    const comments = props.comments;
            
    const renderCommentItem = ({item, index}) => {

        var date = new Date(item.date);
        var currentdate = date.getDate() + '-' + date.getMonth() + '-' + date.getFullYear();
        
        return (
            <View key={index} style={{margin: 10,flexDirection:'column',justifyContent:'space-between',alignItems:'flex-start'}}>
                <Text style={{fontSize: 14,margin:5}}>{item.comment}</Text>
                 <Rating 
                        style={{margin:5}}
                        imageSize={10} 
                        ratingCount={5}
                        readonly 
                        startingValue = {item.rating}
                        />
                <Text style={{fontSize: 12,margin:5}}>{'-- ' + item.author + ', ' + currentdate} </Text>
            </View>
        );
    };
    
    return (
        <Animatable.View animation="fadeInUp" duration={2000} delay={1000}>
        <Card title='Comments' >
        <FlatList 
            data={comments}
            renderItem={renderCommentItem}
            // keyExtractor={item => item.id.toString()}
            />
        </Card>
        </Animatable.View>  
    );
}

function RenderDish(props) {

    const shareDish = (title, message, url) => {
        Share.share({
            title: title,
            message: title + ': ' + message + ' ' + url,
            url: url
        },{
            dialogTitle: 'Share ' + title
        })
    }

    const recognizeDrag = ({ moveX, moveY, dx, dy }) => {
        if ( dx < -200 )
            return true;
        else
            return false;
    }
    const recognizeComment = ({ moveX, moveY, dx, dy }) => {
        if ( dx < 200 )
            return true;
        else
            return false;
    }


    const panResponder = PanResponder.create({
        onStartShouldSetPanResponder: (e, gestureState) => {
            return true;
        },
        onPanResponderGrant: () => {
            this.view.rubberBand(1000)
            .then(endState => console.log(endState.finished ? 'finished' : 'cancelled'));},
        onPanResponderEnd: (e, gestureState) => {
            console.log("pan responder end", gestureState);
            if (recognizeDrag(gestureState))
                Alert.alert(
                    'Add Favorite',
                    'Are you sure you wish to add ' + dish.name + ' to favorite?',
                    [
                    {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                    {text: 'OK', onPress: () => {props.favorite ? console.log('Already favorite') : props.onPress()}},
                    ],
                    { cancelable: false }
                );
            
            else if (recognizeComment(gestureState))
                props.toggleModal();


            return true;
        }
    })

    handleViewRef = ref => this.view = ref;

    const dish = props.dish;
    
        if (dish != null) {
            return(

                <View>
                <Animatable.View animation="fadeInDown" duration={2000} delay={1000}
                ref = {this.handleViewRef}
                 {...panResponder.panHandlers}>
                    <Card
                    featuredTitle={dish.name}
                    image={{uri: baseUrl + dish.image}}>
                        <Text style={{margin: 10}}>
                            {dish.description}
                        </Text>
                        <View style={{flexDirection:"row", justifyContent:"center"}}>
                            <Icon
                                raised
                                reverse
                                name={ props.favorite ? 'heart' : 'heart-o'}
                                type='font-awesome'
                                color='#f50'
                                onPress={() => props.favorite ? console.log('Already favorite') : props.onPress()}
                                />
                            <Icon
                                raised
                                reverse
                                name = 'pencil'
                                type='font-awesome'
                                color='#512DA8'
                                onPress={()=> props.toggleModal()}
                                />
                             <Icon
                                raised
                                reverse
                                name='share'
                                type='font-awesome'
                                color='#51D2A8'
                                style={styles.cardItem}
                                onPress={() => shareDish(dish.name, dish.description, baseUrl + dish.image)} />
                        </View>
                    </Card>
                </Animatable.View>
                </View>
                
            );
        }
        else {
            return(<View></View>);
        }
}

class DishDetail extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            dishes: DISHES,
            comments: COMMENTS,
            favorites: [],
            showModal: false,
            author: "",
            comment:"",
            rating: 0
        };
    }

    static navigationOptions = {
        title: 'Dish Details'
    };

    markFavorite(dishId) {
        this.props.postFavorite(dishId);
    }

    toggleModal() {
        this.setState({showModal: !this.state.showModal});
    }
    
    handleComment(dishId){
        console.log("the state is - ");
        console.log(this.state.author);
        this.props.postComment(dishId,this.state.author,this.state.rating,this.state.comment);
    }    

    render() {
        const dishId = this.props.navigation.getParam('dishId','');
        return(
            <ScrollView>
                <RenderDish dish={this.props.dishes.dishes[+dishId]} 
                favorite={this.props.favorites.some(el => el === dishId)}
                onPress={() => this.markFavorite(dishId)}
                toggleModal={() => this.toggleModal()}/>
                <RenderComments comments={this.props.comments.comments.filter((comment) => comment.dishId === dishId)} />
                <Modal animationType = {"slide"} transparent = {false}
                        visible = {this.state.showModal}
                        onDismiss = {() => this.toggleModal() }
                        onRequestClose = {() => this.toggleModal() }>
                        <View style = {styles.modal} >
                            <Text style = {styles.modalTitle}>Your Comment</Text>
                            <View style={styles.formRow}>
                                <Rating showRating 
                                    imageSize={20} 
                                    ratingCount={5} 
                                    fractions={0}
                                    startingValue = {this.state.rating}
                                    onFinishRating={(value)=> this.setState({rating: value})}/>
                            </View>
                            <View style={styles.formRow}>
                                <Input style = {styles.formItem} 
                                    placeholder = 'Author' 
                                    onChangeText = {(value)=> this.setState({author: value})}
                                    leftIcon = {<Icon raised name='user' type='font-awesome' size={15}/>}
                                    />
                            </View>
                            <View style={styles.formRow}>
                                <Input style = {styles.formItem} 
                                    placeholder = 'Comment'
                                    onChangeText = {(value)=> this.setState({comment: value})}
                                    leftIcon = {<Icon raised name='comment' type='font-awesome' size={15}/>}
                                     />
                            </View>
                        </View>
                        <View style = {styles.formButons}>
                            <Button 
                                color="#512DA8"
                                title="Submit"
                                onPress = {() => {this.handleComment(dishId);this.toggleModal();}}
                                />
                            <Button 
                                onPress = {() =>this.toggleModal()}
                                title="Cancel"
                                color='gray'
                            />
                        </View>
                    </Modal>
            </ScrollView>


        );
    }
}

//onPress = {() =>{this.props.markFavorite(dishId)}}
// function Dishdetail(props) {
//     return(<RenderDish dish={props.dish} />);
// }



const styles = StyleSheet.create({
    formRow: {
      justifyContent: 'center',
      flexDirection: 'row',
      // padding: 10
      marginTop: 10
    },
    formButons: {
      alignItems: 'stretch',
      flexDirection: 'column',
      justifyContent: 'space-around',
      flex: .2,
      marginLeft: 20,
      marginRight: 20
    },
    
    modal: {
       justifyContent: 'center',
       margin: 20
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        backgroundColor: '#512DA8',
        textAlign: 'center',
        color: 'white',
        marginBottom: 20
    },
    modalText: {
        fontSize: 18,
        margin: 10
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(DishDetail);