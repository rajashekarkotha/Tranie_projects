const greet = function(username:string,salutation?:string):string{
  return "Hello " + (salutation ? salutation : "") + username;
}

export default greet;