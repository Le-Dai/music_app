-- 用户表设计
-- 支持多种登录方式：微信、QQ、手机号、邮箱
-- 包含完整的审计字段

CREATE TABLE `users` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '用户主键ID',
  
  -- 基本用户信息
  `username` VARCHAR(50) DEFAULT NULL COMMENT '用户名',
  `nickname` VARCHAR(100) DEFAULT NULL COMMENT '昵称',
  `avatar_url` VARCHAR(500) DEFAULT NULL COMMENT '头像URL',
  `gender` TINYINT DEFAULT 0 COMMENT '性别：0-未知，1-男，2-女',
  `birthday` DATE DEFAULT NULL COMMENT '生日',
  `bio` VARCHAR(500) DEFAULT NULL COMMENT '个人简介',
  
  -- 联系方式
  `phone` VARCHAR(20) DEFAULT NULL COMMENT '手机号码',
  `phone_verified` TINYINT DEFAULT 0 COMMENT '手机号是否验证：0-未验证，1-已验证',
  `email` VARCHAR(100) DEFAULT NULL COMMENT '邮箱地址',
  `email_verified` TINYINT DEFAULT 0 COMMENT '邮箱是否验证：0-未验证，1-已验证',
  
  -- 密码相关（用于邮箱/手机号登录）
  `password_hash` VARCHAR(255) DEFAULT NULL COMMENT '密码哈希值',
  `salt` VARCHAR(32) DEFAULT NULL COMMENT '密码盐值',
  
  -- 微信登录相关
  `wechat_openid` VARCHAR(100) DEFAULT NULL COMMENT '微信OpenID',
  `wechat_unionid` VARCHAR(100) DEFAULT NULL COMMENT '微信UnionID',
  `wechat_nickname` VARCHAR(100) DEFAULT NULL COMMENT '微信昵称',
  `wechat_avatar` VARCHAR(500) DEFAULT NULL COMMENT '微信头像',
  
  -- QQ登录相关
  `qq_openid` VARCHAR(100) DEFAULT NULL COMMENT 'QQ OpenID',
  `qq_nickname` VARCHAR(100) DEFAULT NULL COMMENT 'QQ昵称',
  `qq_avatar` VARCHAR(500) DEFAULT NULL COMMENT 'QQ头像',
  
  -- 账户状态
  `status` TINYINT DEFAULT 1 COMMENT '账户状态：0-禁用，1-正常，2-锁定',
  `login_type` VARCHAR(20) DEFAULT 'phone' COMMENT '注册/主要登录方式：phone,email,wechat,qq',
  `last_login_time` TIMESTAMP NULL DEFAULT NULL COMMENT '最后登录时间',
  `last_login_ip` VARCHAR(45) DEFAULT NULL COMMENT '最后登录IP',
  `login_count` INT DEFAULT 0 COMMENT '登录次数',
  
  -- 学习相关信息（基于你的学习助手应用）
  `student_id` VARCHAR(50) DEFAULT NULL COMMENT '学号',
  `school` VARCHAR(100) DEFAULT NULL COMMENT '学校',
  `major` VARCHAR(100) DEFAULT NULL COMMENT '专业',
  `class_name` VARCHAR(50) DEFAULT NULL COMMENT '班级',
  `grade` VARCHAR(20) DEFAULT NULL COMMENT '年级',
  
  -- 统计信息
  `study_days` INT DEFAULT 0 COMMENT '学习天数',
  `practice_count` INT DEFAULT 0 COMMENT '练习题数',
  `test_count` INT DEFAULT 0 COMMENT '测试次数',
  `average_score` DECIMAL(5,2) DEFAULT 0.00 COMMENT '平均分',
  
  -- 审计字段
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `created_by` BIGINT DEFAULT NULL COMMENT '创建人ID',
  `updated_by` BIGINT DEFAULT NULL COMMENT '更新人ID',
  `version` INT DEFAULT 1 COMMENT '版本号（乐观锁）',
  `is_deleted` TINYINT DEFAULT 0 COMMENT '逻辑删除：0-未删除，1-已删除',
  `deleted_at` TIMESTAMP NULL DEFAULT NULL COMMENT '删除时间',
  
  PRIMARY KEY (`id`),
  
  -- 唯一索引
  UNIQUE KEY `uk_phone` (`phone`) COMMENT '手机号唯一索引',
  UNIQUE KEY `uk_email` (`email`) COMMENT '邮箱唯一索引',
  UNIQUE KEY `uk_wechat_openid` (`wechat_openid`) COMMENT '微信OpenID唯一索引',
  UNIQUE KEY `uk_wechat_unionid` (`wechat_unionid`) COMMENT '微信UnionID唯一索引',
  UNIQUE KEY `uk_qq_openid` (`qq_openid`) COMMENT 'QQ OpenID唯一索引',
  UNIQUE KEY `uk_student_id` (`student_id`) COMMENT '学号唯一索引',
  
  -- 普通索引
  KEY `idx_username` (`username`) COMMENT '用户名索引',
  KEY `idx_nickname` (`nickname`) COMMENT '昵称索引',
  KEY `idx_status` (`status`) COMMENT '状态索引',
  KEY `idx_login_type` (`login_type`) COMMENT '登录方式索引',
  KEY `idx_created_at` (`created_at`) COMMENT '创建时间索引',
  KEY `idx_last_login_time` (`last_login_time`) COMMENT '最后登录时间索引',
  KEY `idx_is_deleted` (`is_deleted`) COMMENT '逻辑删除索引',
  
  -- 复合索引
  KEY `idx_status_deleted` (`status`, `is_deleted`) COMMENT '状态+删除标识复合索引',
  KEY `idx_login_type_status` (`login_type`, `status`) COMMENT '登录方式+状态复合索引'
  
) ENGINE=InnoDB AUTO_INCREMENT=1000000 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户表';

-- 创建用户登录日志表（可选，用于记录登录历史）
CREATE TABLE `user_login_logs` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '日志ID',
  `user_id` BIGINT NOT NULL COMMENT '用户ID',
  `login_type` VARCHAR(20) NOT NULL COMMENT '登录方式：phone,email,wechat,qq',
  `login_ip` VARCHAR(45) DEFAULT NULL COMMENT '登录IP',
  `user_agent` VARCHAR(500) DEFAULT NULL COMMENT '用户代理',
  `login_status` TINYINT DEFAULT 1 COMMENT '登录状态：0-失败，1-成功',
  `login_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '登录时间',
  `remark` VARCHAR(200) DEFAULT NULL COMMENT '备注',
  
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`) COMMENT '用户ID索引',
  KEY `idx_login_time` (`login_time`) COMMENT '登录时间索引',
  KEY `idx_login_type` (`login_type`) COMMENT '登录方式索引',
  KEY `idx_login_status` (`login_status`) COMMENT '登录状态索引'
  
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户登录日志表';

-- 初始化数据示例
INSERT INTO `users` (
  `username`, `nickname`, `phone`, `email`, `student_id`, 
  `school`, `major`, `class_name`, `grade`, `status`
) VALUES (
  'admin', '管理员', '13800138000', 'admin@example.com', 'ADMIN001',
  '示例大学', '计算机科学与技术', '计科2101班', '2021', 1
);

-- 查询语句示例
-- 1. 根据手机号查询用户
-- SELECT * FROM users WHERE phone = '13800138000' AND is_deleted = 0;

-- 2. 根据微信OpenID查询用户
-- SELECT * FROM users WHERE wechat_openid = 'wx_openid_123' AND is_deleted = 0;

-- 3. 查询活跃用户（最近30天有登录）
-- SELECT * FROM users WHERE last_login_time >= DATE_SUB(NOW(), INTERVAL 30 DAY) AND is_deleted = 0;

-- 4. 统计各登录方式的用户数量
-- SELECT login_type, COUNT(*) as count FROM users WHERE is_deleted = 0 GROUP BY login_type;