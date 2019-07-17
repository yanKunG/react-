import React from 'react';
import './Index.css';
import { Button, Grid, Icon, Modal } from 'semantic-ui-react';
import axios from 'axios';
import AvatarEditor from 'react-avatar-editor';

// 选择图片的弹窗
class SelectWindow extends React.Component {
  constructor(props) {
    super(props);
    // 创建ref的引用对象
    this.fileRef = React.createRef();
  }
  handleImageInfo = () => {
    // 获取选中的图片信息
    let img = this.fileRef.current.files[0];
    // console.log(img)
    // 隐藏选择图片的弹窗
    this.props.close(img);
  }
  render() {
    let { open, close } = this.props;
    return (
      <Modal size='small' open={open} onClose={close}>
        <Modal.Header>选择图片</Modal.Header>
        <Modal.Content>
          <input type="file" ref={this.fileRef}/>
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={this.handleImageInfo} positive icon='checkmark' labelPosition='right' content='确定' />
        </Modal.Actions>
      </Modal>
    );
  }
}

// 裁切图片的弹窗
class CropWindow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      scaleValue: 1
    }
  }
  handleScale = (e) => {
    // 控制图片的缩放比例
    this.setState({
      scaleValue: parseFloat(e.target.value)
    });
  }
  setEditorRef = (editor) => {
    // 保存AvatarEditor组件的实例对象
    this.editor = editor;
  }
  cropImage = () => {
    // 实现图片裁切:通过AvartarEditor组件实例获取canvas画布对象
    let canvas = this.editor.getImageScaledToCanvas();
    // 把裁切好的图片转换为base64形式的图片数据
    let imgData = canvas.toDataURL();
    // 调用接口上传图片数据
    axios.post('my/avatar', {
      avatar: imgData
    }).then(res=>{
      if(res.meta.status === 200) {
        // 上传成功，更新头像图片
        this.props.updateAvatar(imgData);
      }
    })
  }
  render() {
    let { open, close, avatar } = this.props;
    return (
      <Modal size='small' open={open} onClose={close}>
        <Modal.Header>裁切图片</Modal.Header>
        <Modal.Content>
          <AvatarEditor
            ref={this.setEditorRef}
            borderRadius={75}
            width={150}
            height={150}
            border={50}
            color={[255, 255, 255, 0.6]} // RGBA
            rotate={0}
            scale={this.state.scaleValue}
            image={avatar}
          />
          <div>
            <span className='avatar-zoom'>缩放:</span>
            <input
              name="scale"
              type="range"
              onChange={this.handleScale}
              min='1'
              max='2'
              step="0.01"
              defaultValue="1"
            />
          </div>
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={this.cropImage} positive icon='checkmark' labelPosition='right' content='确定' />
        </Modal.Actions>
      </Modal>
    );
  }
}


class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      uname: '',
      avatar: '',
      // 选择图片弹窗控制
      selectFlag: false,
      // 裁切图片弹窗控制
      cropFlag: false,
      // 选中的图片文件
      imgFile: null
    }
  }
  hideSelectWindow = (img) => {
    // 隐藏选择图片的的弹窗
    // 如果没有选择图片，不需要显示第二个弹窗
    this.setState({
      // 控制选择图片弹窗的隐藏
      selectFlag: false,
      // 控制裁切图片弹窗的显示
      cropFlag: img?true:false,
      // 上一步选中的图片文件
      imgFile: img
    });
  }
  showSelectWindow = () => {
    // 显示选择图片的弹窗
    this.setState({
      selectFlag: true
    });
  }
  hideCropWindow = () => {
    // 隐藏裁切弹窗
    this.setState({
      cropFlag: false
    });
  }
  updateAvatar = (img) => {
    // 上传成功后更新页面的图片
    this.setState({
      // 更新头像
      avatar: img,
      // 隐藏裁切图片的弹窗
      cropFlag: false
    });
  }
  render() {
    return (
      <div className="my-container">
        {/* 选择图片的弹窗组件 */}
        <SelectWindow open={this.state.selectFlag} close={this.hideSelectWindow}/>
        {/* 裁切图片的弹窗组件*/}
        <CropWindow updateAvatar={this.updateAvatar} avatar={this.state.imgFile} open={this.state.cropFlag} close={this.hideCropWindow}/> 
        <div className="my-title">
          <img src={'http://47.96.21.88:8086/public/my-bg.png'} alt='me'/>
          <div className="info">
            <div onClick={this.showSelectWindow} className="myicon">
              <img src={this.state.avatar} alt="icon"/>
            </div>
            <div className='name'>{this.state.uname}</div>
            <Button color='green' size='mini'>已认证</Button>
            <div className='edit'>编辑个人资料</div>
          </div>
        </div>
        <Grid padded  className='my-menu'>
          <Grid.Row columns={3}>
            <Grid.Column>
              <Icon name='clock outline' size='big' />
              <div>看房记录</div>
            </Grid.Column>
            <Grid.Column>
              <Icon name='yen sign' size='big' />
              <div>我的订单</div>
            </Grid.Column>
            <Grid.Column>
              <Icon name='bookmark outline' size='big' />
              <div>我的收藏</div>
            </Grid.Column>
            <Grid.Column>
              <Icon name='user outline' size='big' />
              <div>个人资料</div>
            </Grid.Column>
            <Grid.Column>
              <Icon name='home' size='big' />
              <div>身份认证</div>
            </Grid.Column>
            <Grid.Column>
              <Icon name='microphone' size='big' />
              <div>联系我们</div>
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <div className='my-ad'>
          <img src={'http://47.96.21.88:8086/public/ad.png'} alt=""/>
        </div>

      </div>
    );
  }
  componentDidMount() {
    // 调用接口获取用户信息
    let uid = sessionStorage.getItem('uid');
    axios.post('my/info', {
      user_id: uid
    }).then(res=>{
      this.setState({
        uname: res.data.username,
        avatar: res.data.avatar
      });
    })
  }
}

export default Home;