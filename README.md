### TPSQL

#### 使用方式
##### 实例化模型
```javascript
    $model = new Model();
    $model.table('user').where({'name':'dudeyouth'}).select();
    // 上面的例子等同于
    class UserModel extends Model{
        getUserMsg(){
            this.where({'name':'dudeyouth'}).select();
        }
    }
    $um = new UserModel();
    $um.getUserMsg();
```

+ table()
选择查询表
```javascript
    $model.table('user').select();
    // select * from user where name='dudeyouth';
    $model.table('user u').select();  // 给表起别名
    // select * from user u where name='dudeyouth';
```

+ field()
选择查询的字段名
```javascript
    $model.table('user').field('id,name,avatar').select();
    // select id,name,avatar from user;
    $model.table('user').field('id,name username,avatar headimg').select();  // 给字段起别名
    // select id,name username,avatar headimg from user;
```
+ where()
* and 与条件查询
```javascript
    $model.table('user').where({'uid':5,'name':'dudeyouth'}).select();
    // select * from user where uid=5 and name='dudeyouth';
```
* or 或条件查询
```javascript
    $model.table('user').where({'uid':5,'or':{'name':'dudeyouth'}}).select();
    // select * from user where uid=5 or name='dudeyouth';
```
* in 区域查询 
```javascript
    $model.table('user').where({'uid':{'in':[1,2,2]}}).select();
    // select * from user where uid in (1,2,3);
```
+ or

