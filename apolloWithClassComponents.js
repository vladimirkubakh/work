/*Подключаем клиент и кэш для работы аполло*/
const client = new ApolloClient({
    uri: 'http://localhost:8000/graphql/',
    cache: new InMemoryCache()
  });


/*Перечисляем основные запросы и мутации
для работы компонента*/
let MUTATION = gql`
  mutation {
    КАКАЯ-ТО МУТАЦИЯ
  }`;


/*HOC, который заэнхейнсит классовый компонент
и позволит юзать аполло в нём. Его задача только
пробросить колбэки для работы с аполло*/
let Сonnector = function(Component, Querie){
  return function() {
    let [mutate] = useMutation(Querie);
    return (
        <Component mutate={mutate}/>
    );
  };    
};


/*Сам классовый компонент, который не может
использовать аполловские хуки, но содержит основную
логику*/
class BehaviorClassComponent extends React.Component {

  constructor(props){
    super(props);
    this.state = {data:""};
    this.someHandler = this.someHandler.bind(this);
  }

  someHandler(){
    this.props.mutate({variables:{data:this.state.data}}).then((result)=>console.log(result));
  }

  render(){
    return (
      <>
      <input type="text" value={this.state.data} onChange={(e)=>{this.setState({data:e.target.value})}}/>
      <button onClicl={this.someHandler}/>
      </>
    );
  }
}



let EnhancedBehaviorClassComponent = Connector(BehaviorClassComponent, MUTATION);



ReactDOM.render(
  <ApolloProvider client={client}>
    <EnhancedBehaviorClassComponent/>
  </ApolloProvider>,
  document.getElementById('root')
);



