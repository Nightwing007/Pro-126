import * as React  from "react"
import { Button,Image,View,Platform,Alert } from "react-native"
import * as ImagePicker from "expo-image-picker"
import * as Permissions from "expo-permissions"

export default class PickImage extends React.Component{
    state = {
        Image : null
    }
    render(){
        let {Image} = this.state
        return (
            <View>
            <Button title = "Pick A Image" onPress = {this.pickImage()}/>
            </View>
        )
    }
    componentDidMount(){
        this.getPermission()
    }

    getPermission=async()=>{
        if(Platform.OS !== "web"){
            const {Status} = await Permissions.askAsync(Permissions.CAMERA_ROLL)
            if({Status} !== "granted"){
                Alert.alert("Sorry!! We need camera permissions.")
            }
        }
    }

    pickImage=async()=>{
        try {
            let Result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes : ImagePicker.mediaTypes.All,
                allowsEditing : true,
                aspect : [4,3],
                quality : 1
            })
            if(!Result.cancelled){
                this.setState({
                    Image : Result.data
                })
                console.log(Result.uri)
                this.uploadImage(Result.uri)
            }
        } 
        catch (error) {
            console.log("Error")
        }
    }

    uploadImage=async(uri)=>{
        const data = new FormData()
        let fileName = uri.split("/")[uri.split("/").length - 1]
        let type = `Image/${uri.split(".")[uri.split("/").length - 1]}`
        const fileToupload = {
            uri : uri,
            name : fileName,
            type : type,
        }
        data.append("digit",fileToupload)
        fetch( "http://d837-202-168-84-7.ngrok.io/get-digit",{
            method : "POST",
            body : data,
            headers : {
                "content-type" : "multipart/form-data",
            }   
        })
        .then((response)=>response.json())
        .then((Result)=>{
            console.log("Success!! : ",Result)
        })
        .catch((error)=>{
            console.log("ERROR : ",error)
        })
    }

} 