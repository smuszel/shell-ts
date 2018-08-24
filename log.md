1. I wanted to clean out shxes
2. Also I wanted to abstract out pieces of functionality to helper layer
3. I saw that helpers should also use dsl like approach
4. Then my quest to make it work with typescript began
5. At first i tried to make function keyword work
6. Then I found that i can Object.assign to give props to either named or anonyms
7. But It was quite verbose and confusing for nested dsl.
8. So then I just relized i can give interfaces to functions
9. In which i implement callability and props
10. Then i export default one function that has subfunction props
11. Now your job is to implement that accross the lib
12. Start by resolving each of the commands to be cleanly fit to the concept
13. After succeeded test move to other command

---

1. Acually its cleaner with assign and inline props
2. I went scouring through typescript docs
3. I found out about union types and aliases
4. And infrence through guards
5. And esnext flat/flatmap support
6. And unknown type
7. Also I dabbed a bit in generics