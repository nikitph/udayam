// @flow
import React, {PropTypes} from "react";
import {ScrollView, Text, KeyboardAvoidingView, View, Animated, Easing} from "react-native";
import {connect} from "react-redux";
import moment from "moment";
// Add Actions - replace 'Your' with whatever your reducer is called :)
import RiseSetActions from "../Redux/RiseSetRedux";
import {Images} from "../Themes";
// external libs
import * as Animatable from "react-native-animatable";
// Styles
import styles from "./Styles/RiseSetScreenStyle";
import RoundedButton from "../Components/RoundedButton";
// I18n

class RiseSetScreen extends React.Component {

  constructor(props) {
    super(props);
    this.spinValue = new Animated.Value(0);


    this.state = {
      latitude: null,
      longitude: null,
      error: null,
    };
  }


  spin() {
    this.spinValue.setValue(0)
    Animated.timing(
      this.spinValue,
      {
        toValue: 1,
        duration: 100000,
        easing: Easing.linear
      }
    ).start(() => this.spin())
  }


  componentDidMount() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          error: null,
        });
      },
      (error) => this.setState({error: error.message}),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
    );

    this.spin();
  }


  render() {

    const spin = this.spinValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg']
    });

    return (
      <ScrollView style={styles.container}>
        <View style={styles.containertwo}>
          <Animatable.View animation='fadeIn' style={{flex:0.35, justifyContent:'center', marginTop:25}}>
            <Animated.Image source={Images.sun}
                            style={{flex:0.25, alignSelf:'center', resizeMode:'contain',transform: [{rotate: spin}]}}>

            </Animated.Image>
          </Animatable.View>
          <View style={{flex:0.1, justifyContent:'center', alignItems:'center'}}>
            <Animatable.Text animation='fadeIn'
                             style={{fontFamily:'Avenir',color:'#F4840B',fontSize:24}}>{!this.props.isfetching && this.props.sunrise != null ? 'Sunrise : ' + moment.utc(this.props.sunrise).local().format('LT') : '' }</Animatable.Text>

          </View>


          <Animatable.View animation='fadeIn' style={{flex:0.35, justifyContent:'center', backgroundColor: '#022730'}}>
            <Animated.Image source={Images.moon}
                            style={{flex:0.25, alignSelf:'center', resizeMode:'contain', transform: [{rotate: spin}]}}>

            </Animated.Image>
          </Animatable.View>

          <View style={{flex:0.1, justifyContent:'center', backgroundColor: '#022730', alignItems:'center'}}>
            <Animatable.Text animation='fadeIn'
                             style={{fontFamily:'Avenir',color:'#DCF9F6',fontSize:24}}>{!this.props.isfetching && this.props.sunset != null ? 'Sunset : ' + moment.utc(this.props.sunset).local().format('LT') : '' }</Animatable.Text>

          </View>

          <View style={{flex:0.1, justifyContent:'center'}}>
            <RoundedButton onPress={()=>this.props.riseSetReq({lat:this.state.latitude, lang:this.state.longitude})}>
              Component Examples Screen
            </RoundedButton>
          </View>


        </View>
      </ScrollView>
    )
  }

}

RiseSetScreen.propTypes = {

  riseSetReq: PropTypes.func,
  sunrise: PropTypes.string,
  sunset: PropTypes.string,
  isfetching: PropTypes.bool

};

const mapStateToProps = (state) => {
  console.tron.log(moment.utc(state.riseset.payload.sunrise).local().format('lll'));
  return {
    sunrise: state.riseset.payload.sunrise,
    sunset: state.riseset.payload.sunset,
    isfetching: state.riseset.isfetching

  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    riseSetReq: (params) => dispatch(RiseSetActions.riseSetRequest(params))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(RiseSetScreen)
