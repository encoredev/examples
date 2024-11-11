package shoppinglist
import (
	"encore.dev/storage/sqldb"
	"gorm.io/gorm"
	"gorm.io/driver/postgres"

)
//encore:service 
type Service struct {
	db *gorm.DB 

}
var db = sqldb.NewDatabase("shoppinglist",sqldb.DatabaseConfig{
	Migrations: "./migrations",
})

func initService() (*Service,error){
	db,err :=gorm.Open(postgres.New(postgres.Config{
		Conn: db.Stdlib(),
	}))
	if err != nil {
		return nil,err
	}
	return &Service{db: db},nil;

}