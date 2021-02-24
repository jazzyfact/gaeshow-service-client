## 규칙

-   organization 레포지토리를 포크하고 개발한 다음 PR하는 방식으로 개발할 것

-   commit전에 eslint 적용하고 commit할 것 (auto로 eslint를 적용할 수 있음)

### Git-Commit Message 규칙

[ADD] : 파일, 변수, 클래스, 함수 등 기능 추가했을 때  
[FIX] : 디버깅이나 에러 수정했을 때  
[MD] : modify 줄임, 배경색상이나 텍스트 등 변경사항 있을때  
[RM] : remove 줄임, 기능 삭제했을 때  
[RF] : refacto 줄임, 리팩토링 했을 때 (변수/함수 이름 바꾸거나, 코드 스타일 변경)

### 실행시키는 방법

####1. sass 명령어로 css 변환

**sass 명령어**

맨 처음 명령어

node-sass --output-style expanded public/css/scss/styles.scss --output public/css

css 변경후 두 번째부터 명령어

node-sass --watch public/css/scss --output public/css

**vscode sass 실시간 변환기**

1. live sass compoiler 플러그인 설치.
2. 설정에서 css 폴더로 변환 폴더 잡아주기
3. 저장시 자동으로 css 파일로 변경됨.

#### 2. node 실행

##### 2-1 module 설치

`npm i`

2-2 실행

##### Compiles and hot-reloads for development

`npm run start`

##### Compiles and minifies for production

`npm run build` (pm2 설치한 상태여야 함)

#### 3. 프로젝트 구조

```
/public                            : 웹 클라이언트와 관련된 코드가 있는 폴더
   /css                            : scss 폴더와 컴파일 후의 css 파일이 있는 폴더
       /scss                       : scss 파일들을 저장하는 폴더
   /images                         : 추천 이미지들이 위치
   /js                             : js 폴더
       /Controller                 : 모델과 뷰를 연결해주는 컨트롤러 폴더
           users.controllers.js    : users.models.js에서 가져온 데이터를 users.view.js로 전달하는 파일,
                                     혹은 users.view.js의 이벤트를 model로 전달해주는 파일
       /Core                       : 프로젝트에 핵심이 되는 코드가 있는 폴더
            /Mvc                   : mvc패턴으로 정의할 부모클래스 파일들이 있는 폴더
                Model.js           : 서버 통신과 관련된 함수들을 정의해놓은 싱글톤 파일
                View.js            : html 요소를 생성하거나 가져오는 함수가 기록된 파일
            /Singleton             : 중복되는 변수, 함수들을 모아놓은 폴더
                Singleton.js       : 로직과 관련된 싱글톤 파일
                utils.js           : ui와 관련된 싱글톤 파일
       /Model                      : 서버 통신과 관련된 폴더
           users.models.js         : 유저와 관련된 데이터를 로드할 때 사용하는 파일
       /View                       : 보여지는 것과 관련된 파일
           users.view.js           :
       on.load.js                  : ../index.html 파일에서 유일하게 로드하는 파일
   index.html                      : 메인 html 파일
   login.html                      : 로그인 html 파일
.babelrc                           : babel 설정 파일
.eslintignore                      : eslint를 적용하지 않을 파일들을 적어놓는 파일
.eslintrc                          : eslint 설정 파일
.gitignore                         : git으로 관리하지않을 파일들을 적어놓는 파일
app.js                             : app 진입점
config.js                          : webstrom에서 babel alias를 인식하기 위한 파일
package.json                       : express 설정 파일
package-lock.json                  : express 설정 파일 (정확한 의존성 기록을 위해 사용)
README.md                          : 프로젝트와 관련된 내용을 적어놓는 파일
```

##### 3-1 SCSS 파일 설명 (SCSS 폴더내 파일들)

```
/_mixin.scss                        :   반응형 관련 파일
/_variables.scss                    :   속석값에 들어갈 변수 정의 파일
/default.scss                       :   페이지 주요 큰틀에 관련된 레이아웃 설정 scss 파일
/reest.scss                         :   브라우저별 다른 엘러먼트 속성값 초기화 시켜 주는 파일
/ui.scss                            :   세부적인 아이템, 공통적으로 사용하는 아이템 들의 정의되어 있는 스타일 파일
/index.scss                         :   index.html 의 스타일 파일
```
