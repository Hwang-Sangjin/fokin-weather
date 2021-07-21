import { StatusBar } from 'expo-status-bar';
import React from 'react';
import {Alert} from "react-native";
import Loading from "./Loading";
import Weather from "./Weather";
import * as Location from 'expo-location';
import axios from 'axios';

const API_KEY = "f65e2d149edfee4aed4c46fc28b6dce1";

export default class extends React.Component {
  state = {
    isLoading: true
  };
  getWeather = async(latitude,longitude) => {
    const {
      data : {
        main : {temp},
        weather,
        name
      }
    } = await axios.get(
      `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
    );
    this.setState({
      isLoading : false,
      condition: weather[0].main, 
      temp,
      city: name
    });
  };
  getLocation = async() => {
    try{
      await Location.requestPermissionsAsync();
      const {coords: {latitude,longitude}} = await Location.getCurrentPositionAsync();
      this.getWeather(latitude,longitude)
      
    }
    catch(error){
      Alert.alert("Can't find you.","So Sad");
    }
  };
  componentDidMount(){
    this.getLocation();
  }
  render(){
    const {isLoading, temp, condition,city} = this.state;
    return isLoading ? <Loading/> : <Weather temp={Math.round(temp)} condition={condition}  city = {city}/>;
  }
}


