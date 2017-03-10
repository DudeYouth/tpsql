# TPSQL

## 使用方式

### 数据库配置
> 配置文件路径在项目根目录：conf/db.json
```javascript
{
    "host": "",  // 数据库地址
    "user": "",  // 用户名
    "password": "", // 密码
    "database": "", // 数据库名字
    "port": 3306,  // 端口
    "prefix":"" // 数据表前缀
    "logsrc":"" // 日志地址
}
```

### 实例化模型
>
```javascript
    // 第一种实例化方式
    $model = new Model();
    $model.table("user").where({"name":"dudeyouth"}).select();
    // 第二种实例化方式（建议使用，适用于MVC模式的M层）
    class UserModel extends Model{
        getUserMsg(){
            return this.where({"name":"dudeyouth"}).select();
        }
    }
    $um = new UserModel();
    $um.getUserMsg();
```

### table
> 选择查询表    
```javascript
    $model.table("user").select();
    // select * from user;
    $model.table("user u").select();  // 给表起别名
    // select * from user u;
```

### alias
> 表别名   
```javascript
    $model.table("user").alias('u').select();
    // select * from user u;
```
### field
> 选择查询的字段名
```javascript
    $model.table("user").field("id,name,avatar").select();
    // select id,name,avatar from user;
    $model.table("user").field("id,name username,avatar headimg").select();  // 给字段起别名
    // select id,name username,avatar headimg from user;
```

### where
> and 与条件查询
```javascript
    $model.table("user").where({"uid":5,"name":"dudeyouth"}).select();
    // select * from user where uid=5 and name="dudeyouth";
```
> or 或条件查询
```javascript
    $model.table("user").where({"uid":5,"name":["or","dudeyouth"]}).select();
    // select * from user where uid=5 or name="dudeyouth";
```
> in 区域查询 
```javascript
    $model.table("user").where({"uid":{"in":[1,2,3]}}).select();
    // select * from user where uid in (1,2,3);
```
> like 模糊查询 
```javascript
    $model.table("user").where({"name":{"like":'%dudeyouth%'}}).select();
    // select * from user where name like '%dudeyouth%';
```
> between 模糊查询 
```javascript
    $model.table("user").where({"name":{"between":[]}}).select();
    // select * from user where name between 1,2;
```
> exp 执行sql语句
```javascript
    $model.table("user").where({"exp":'uid=1').select();
    // select * from user where uid=1;
```   

> 等式查询
```javascript
    /* lt 小于*/
    $model.table("user").where({"uid":{"lt":3}}).select();
    // select * from user where uid < 3;
    /* gt 大于*/
    $model.table("user").where({"uid":{"gt":3}}).select();
    // select * from user where uid > 3;
    /* elt 小于等于*/
    $model.table("user").where({"uid":{"elt":3}}).select();
    // select * from user where uid <= 3;
    /* egt 大于等于*/
    $model.table("user").where({"uid":{"egt":3}}).select();
    // select * from user where uid >= 3;
    /* neq 不等于*/
    $model.table("user").where({"uid":{"neq":3}}).select();
    // select * from user where uid != 3;
```

### group
> 分组
```javascript
    $model.table("user").field("count(*)").where({"uid":[1,2,3,4,5]}).group("level").select();
    // select * from user where uid in (1,2,3);
```

### having
> 分组的条件
```javascript
    $model.table("user").where({"uid":[1,2,3,4,5]}).group("level,uid").having("count(uid)>2").select();
    // select * from user where uid in (1,2,3);
```

### order
> 排序
```javascript
    $model.table("user").where({"uid":[1,2,3,4,5]}).order("create_time DESC").select();
    // select * from user where uid in (1,2,3);
```

### limit
> 分页
```javascript
    $model.table("user").where({"uid":[1,2,3,4,5]}).limit("10,15").select();
    // select * from user where uid in (1,2,3);
```

### select
> 查询所有符合条件的数据
```javascript
    $model.table("user").where({"uid":[1,2,3,4,5]}).select();
    // select * from user where uid in (1,2,3);
    // 输出：[{uid:1,name:...,create_time:...},{uid:2,name:...,create_time:...},{uid:3,name:...,create_time:...}...]
```

### find
> 查询第一条符合条件的数据
```javascript
    $model.table("user").where({"uid":5}).find();
    // select * from user where uid =5;
    // 输出：{uid:5,name:...,create_time:...}
```

### getField
> 获取符合条件的字段内容（只获取1个）
```javascript
    $model.table("user").where({"uid":[1,2,3,4,5]}).getField("name");
    // select name from user where uid in (1,2,3,4,5) limit 1;
    // 输出：name
```
> 获取符合条件的字段内容（获取所有）
```javascript
    $model.table("user").where({"uid":[1,2,3,4,5]}).getField("name",true);
    // select name from user where uid in (1,2,3,4,5);
    // 输出：[name1,name2,name3,name4,name5]
```

### add 
> 插入数据
```javascript
    $model.table("user").add({"name":"dudeyouth","create_time":1482613131});
    // insert into user set name="dudeyouth",create_time=1482613131;
```

### update
> 更新数据
```javascript
    $model.table("user").update({"name":"dudeyouth","create_time":1482613131});
    // update user set name="dudeyouth",create_time=1482613131;
```

### delete
> 删除数据
```javascript
    $model.table("user").where({"uid":5}).delete();
    // delete from user where uid=5;
```

### join
> 联表inner join
```javascript
    $model.table("user u").join("user_group ug on u.id=ug.uid").select();
    // select * from user u inner join user_group ug on u.id=ug.uid;
```

### leftJoin
> 联表left join
```javascript
    $model.table("user u").leftJoin("user_group ug on u.id=ug.uid").select();
    // select * from user u left join user_group ug on u.id=ug.uid;
```

### rightJoin
> 联表right join
```javascript
    $model.table("user u").rightJoin("user_group ug on u.id=ug.uid").select();
    // select * from user u right join user_group ug on u.id=ug.uid;
```



