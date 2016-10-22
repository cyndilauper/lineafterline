import React from 'react'
import Line from './Line'
import Help from '../helpers'
import io from 'socket.io-client'

const socket = io('http://localhost:8081')

class Story extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      storyId: this.props.params.id,
      title: '',
      users: [],
      complete: false,
      length: 0,
      numberUsers: 0,
      currentLine: 0,
      lines: [],
      currentUser: null,
      prevLineIndex: 0
    }
  }


  //once the component renders
  componentDidMount () {
    //retrieve story data from server via helpers
    $.get(`http://localhost:8081/stories/${this.state.storyId}`)
    .then(story => {
      console.log('Got story: ', story)
      //set state with this data
      this.setState({
        title: story.title,
        users: story.users,
        complete: story.complete,
        length: story.length,
        numberUsers: story.numberUsers,
        currentLine: story.currentLine,
        lines: story.lines
      })
      $.get('http://localhost:8081/user')
      .then(user => {
        
        
        const prevLineIndex = (this.state.currentLine ? this.state.currentLine - 1 : this.state.currentLine)

        this.setState({
          currentUser: user,
          prevLineIndex: prevLineIndex
        })
        console.log('currentUser: ', this.state.currentUser)
        console.log('prevLineIndex' , this.state.prevLineIndex)
      }) 
    })
    socket.emit('salty slug')
  }

  //catch bubbled up events from line component
  // manageProgress(e){
  //   //track story progress
  //   this.setState({
  //     prevLine: this.state.prevLine + 1
  //   })
  //   //if progress shows story is complete
  //   if (this.state.prevLine === this.state.length){
  //     this.manageCompletion()
  //   }
  // }

  // manageCompletion(){
  //   console.log("story complete!")
  // }
      
  render(){
    if (this.state.currentUser) {
      console.log('there is a user')
      const prevLine = this.state.lines[this.state.prevLineIndex]
      const currLine = {userId: this.state.currentUser.id, text: '', story: this.state.storyId}
      return (
        <div className="storyContainer" >  
          <h2 className="title">{ this.state.title }</h2>
          
          {
            this.state.prevLineIndex === 0 

            ?

            <Line line={currLine} lock={false} />
            
            :
            <div>
            <Line line={prevLine} lock={true} />
            <Line line={currLine} lock={false} />
            </div>
          }

        </div>  
      )
    } else {
      console.log('there is no user')
      return (
        <div>
          <h2>loading</h2>
        </div>
      )
    }

  }

}

export default Story