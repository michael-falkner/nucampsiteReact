import React from 'react';
import 'font-awesome/css/font-awesome.css';
import { Modal, ModalHeader, FormFeedback, ModalBody, Label, Card, CardImg, CardText, CardBody, Breadcrumb, BreadcrumbItem, Button } from 'reactstrap';
import { Link } from 'react-router-dom';
import { FadeTransform, Fade, Stagger } from 'react-animation-components';
import { LocalForm, Control, Errors } from 'react-redux-form';
import { ConfigureStore } from '../redux/configureStore';
import { Loading } from './LoadingComponent';
import { baseUrl } from '../shared/baseUrl';



class CommentForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isModalOpen: false,
            rating: '',
            author: '',
            text: '',
        };

        

     }

     toggleModal = () => {
        this.setState({
            isModalOpen: !this.state.isModalOpen
        });
    }
    
    handleSubmit(values) {
        this.toggleModal();
        this.props.postComment(this.props.campsiteId, values.rating, values.author, values.text);
    }

    render() {
       //Modal Below with validation
        return(
            <div>
             <Button outline onClick={this.toggleModal}><i className="fa fa-lg fa-pencil" aria-hidden="true"/>Submit Comment</Button>
             <Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal}>
                 <ModalHeader toggle={this.toggleModal}>
                     Submit Comment
                 </ModalHeader>
                 <ModalBody>
                    <LocalForm onSubmit ={(values) => this.handleSubmit(values)}>
                        <div className="form-group">
                        <Label htmlFor="rating">Rating 1 is the worst and 5 is the best!</Label>
                            <Control.select defaultValue="1" className="form-control" model=".rating" id="rating" name="rating">
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="5">5</option>
                            </Control.select>

                        </div>
                        <div className="form-group">
                            <Label htmlFor="author">Your Name</Label>
                            <Control.text placeholder="Your Name" 
                            className="form-control" model=".author" 
                            id="author" name="author"
                            validators={{
                                required: (val) => val && val.length >0,
                                minLength: (val) => val && val.length >2,
                                maxLength: (val) => val && val.length < 15,
                            }}>
                                
                            </Control.text>
                            <Errors
                            className="text-danger"
                            model=".author"
                            show="touched"
                            component="div"
                            messages={{
                                required: "Required",
                                maxLength: "Must be less than 15 characters",
                                minLength: "Must be at least 2 characters",

                            }} />
                        </div>
                        <div className="form-group">
                            <Label htmlFor="text">Comment</Label>
                            <Control.textarea className="form-control" 
                            model=".text" 
                            id="text" 
                            name="text" 
                            rows="6"
                            >
                                
                            </Control.textarea>
                        </div>
                        <Button type="submit" color="primary">Submit</Button>
                    </LocalForm>
                 </ModalBody>
             </Modal>
            </div>
        );
    }
}

/*Displays the campsite clicked*/
function RenderCampsite({campsite}) {
        console.log(campsite);
        return (
            <div className="col-md-5 m-1">
            <FadeTransform
                in
                transformProps={{
                    exitTransform: 'scale(0.5) translateY(-50%)'
                }}>
                <Card>
                    <CardImg top src={baseUrl + campsite.image} alt={campsite.name} />
                    <CardBody>
                        <CardText>{campsite.description}</CardText>
                    </CardBody>
                </Card>
            </FadeTransform>
        </div>

        );
    }

    /*Displays comments using the map function */
    function RenderComments({comments, postComment, campsiteId}) {
        if(comments) {
            return (
                <div className="col-md-5 m-1">
                                    <h4>Comments</h4>
                <Stagger in>
                    {
                        comments.map(comment => {
                            return (
                                <Fade in key={comment.id}>
                                    <div>
                                        <p>
                                            {comment.text}<br />
                                            -- {comment.author}, {new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: '2-digit'}).format(new Date(Date.parse(comment.date)))}
                                        </p>
                                    </div>
                                </Fade>
                            );
                        })
                    }
                </Stagger>
                <CommentForm campsiteId={campsiteId} postComment={postComment} />
                </div>
            );
                
        } else {
            return (
                <div>Add the first comment for this campsite!
                    <CommentForm /></div>
            );
        };
    }
function CampsiteInfo(props) {
    if (props.isLoading) {
        return (
            <div className="container">
                <div className="row">
                    <Loading />
                </div>
            </div>
        );
    }
    if (props.errMess) {
        return (
            <div className="container">
                <div className="row">
                    <div className="col">
                        <h4>{props.errMess}</h4>
                    </div>
                </div>
            </div>
        );
    }
    if (props.campsite) {
            return (
                <div className="container">
                    <div className="row">
                        <div className="col">
                            <Breadcrumb>
                                <BreadcrumbItem><Link to="/directory">Directory</Link></BreadcrumbItem>
                                <BreadcrumbItem active>{props.campsite.name}</BreadcrumbItem>
                            </Breadcrumb>
                            <h2>{props.campsite.name}</h2>
                            <hr />
                        </div>
                    </div>
                    <div className="row">
                        <RenderCampsite campsite={props.campsite} />
                    <RenderComments 
                        comments={props.comments}
                        postComment={props.postComment}
                        campsiteId={props.campsite.id}
                    />
                    </div>
                </div>
            );

        
        } else {
            return (<div></div>);
        }

            
        
    }


export default CampsiteInfo;