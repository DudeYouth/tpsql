### TPSQL

#### 使用方式
##### 实例化模型
```javascript
    $m = new Model();
    $m ->table('user').where({'name':'dudeyouth'}).select();
    // 上面的例子等同于
    class UserModel extends Model{
        getUserMsg(){
            this.where({'name':'dudeyouth'}).select();
        }
    }
    $um = new UserModel();
    $um.getUserMsg();
``` 
