## Linux操作系统介绍

### Linux历史

Linux操作系统诞生于1991年10月5日（这是第一次正式向外公布时间）。Linux存在着许多不同的Linux版本，但它们都使用了Linux内核。Linux可安装在各种计算机硬件设备中，比如收、平板电脑、路由器、视频游戏控制台、台式计算机、大型机和超级计算机。

### Linux和window的比较

1. Linux的界面风格是多变的，window风格是统一的。因为Linux有不同的发行版。
2. Linux的文本界面（命令行）比window强大很多

### Linux的发行版

Linux的发行版说简单点就是将Linux内核与应用软件做一个打包。

较知名的发行版有：Ubuntu（图形界面美观）、RedHat、CentOS（主要用于做服务器）、Debain、Fedora、SUSE、OpenSUSE、TurboLinux、BlurPoint、RedFlag、Xterm、SlackWare等。

## 虚拟机

> 虚拟机（Virtual Machine）指通过软件模拟的具有完全硬件系统功能的、运行在一个完全隔离环境中的完整计算机系统。

流行的虚拟机软件有VMware、Virtual Box 和Virtual PC，它们都能在Windows系统上虚拟出多个计算机。

1. VMware：商业化虚拟机，收费      建议使用
2. Virtual Box：开源的虚拟机、oracle维护
3. Virtual PC : 免费使用、微软维护

## Windows命令行入门

```bash
dir：查看当前目录下的文件和文件夹
                第一栏：文件夹或文件创建的日期
                第二栏：文件或文件夹创建的时间
                第三栏：表示这个是文件还是文件夹（有DIR标记的是文件）（文件的话显示的是文件的大小：以字节为单位）。
cd 文件夹名称： 切换目录
    cd .. ：切换到上一级目录

md 文件夹名称：创建文件夹

copy 源文件  目标文件夹：复制文件

del 文件名 ：删除文件

rename 文件名：为文件改名字
```

## Linux命令入门

```bash
ls 或者dir： 查看目录下的子目录和文件（短格式）
ls -l：查看目录下的子目录和文件（长格式）
                第一栏：访问权限
                第二栏：文件之内存在的数量
                第三栏和第四栏：当前的目录或文件属于哪一个用户组和用户
                第五栏：当前的目录或文件的大小：对于目录来说大小的值是固定的，对于文件来说就是文件的大小
                后面的内容是当前目录或文件创建的时间
                最后一个栏目是文件的名称
ls -a ：显示文件（包括隐藏文件）
                在Linux中只要文件前面加一个点就表示隐藏文件
                一个点的文件名表示当前目录
                两个点的文件名表示上级目录
ls -al：
cd 文件名：切换目录（文件名严格区分大小写）
        cd ..  ：退回上一级目录
        cd /：根目录
        cd ~：用户目录

mkdir 文件名：创建目录
        同一级下不能存在两个同名的目录或文件

cp 源文件名   复制到的文件目录/文件名  ：复制文件

cp -R  源目录   复制到的文件目录/目录名：复制目录       （修改文件名可用此命令）

pwd：显示当前目录的全部路径

rm 文件名：删除文件
rm -r 目录名称：删除目录（如果目录下有子目录或者子文件的话会提示是否继续删除）
rm -rf 目录名称：强制删除目录（ r递归、f强制删除）


touch 文件名：新建文件

mv 源文件名  目标目录 ：移动文件或者目录

shutdown -h now ：立即关机
shutdown -r now  /reboot：立刻重启计算机

su -root ：先用普通账户登录再切换 sudo临时已管理员操作

logout：用户注销

ln -s：源文件  目标文件  建立软链接

startX或者init 5 （init[0123456]）
        init的状态值：0：关机、1：单用户、2：多用户状态没有网络服务、3：多用户状态有网络服务
                              4：系统未使用保留给用户、5：图形界面、6：系统重启


clear：清楚命令行
```

## Cygwin

Cygwin是windows操作系统下能够使用Linux命令的终端，同样的还有Cmder

[Cmder的官网](http://cmder.net/)

[Cygwin的官网](www.cygwin.com)

## vim命令

![vim.png](http://cdn-blog.liusixin.cn/vim.png)
