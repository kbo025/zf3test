<?php
namespace Application\Model;

class Client 
{
    const url = 'https://app.alegra.com/api/v1/contacts/';
    const token = '';
    const email = 'kbo025@gmail.com';

    private $id;
    private $name;
    private $identification;
    private $email;
    private $phonePrimary;
    private $phoneSecondary;
    private $fax;
    private $mobile;
    private $observations;
    private $type; //["client", "provider"],
    private $address; //{"address" : "Calle principal #45","city" : "Barcelona"},
    private $city;
    private $seller; //{"id" : "12","name" : "Diana Giraldo","identification" : "520.526.21","observations" : "Líder de Ventas"},
    private $term; //{"id" : 1,"name" : "8 días","days" : 8},
    private $priceList; //{"id" : 5,"name" : "Distribuidor"},
    private $internalContacts; //[{"id" : 1,"name" : "Andrea","lastName" : "Restrepo","email" : "prueba3@alegra.com","phone" : "999-99-99 ext 105","mobile" : "","sendNotifications" : "yes"}]

    public function __construct($data = null)
    {
        if (!empty($data) && is_array($data)) {
            $this->setAtrributes($data);
        }
    }

    public function get($att)
    {
        return ( isset($this->$att) ? $this->$att : null );
    }

    public function set($att,$val)
    {
        $this->$att = $val;

        return $this;
    }

    public function setAtrributes($data)
    {
        if (is_array($data)) {
            foreach($data as $att => $val) {
                $this->set($att,$val);
            }
            return true;
        }
        return false;
    }

    public function serialize()
    {
        $response = [];
        foreach($this as $att => $val)
        {
            $response[$att] = $val;
        }
        return $response;
    }

    public function search($page = 1, $start = 0,  $limit = 10, $query = null, $type = null, $order_field = 'name',$order_direction = 'ASC')
    {
        try {
            $params = [
                'start' => $start,
                'limit' => $limit,
                'order_field' => $order_field,
                'order_direction' => $order_direction,
                'query' => $query,
                'type' => $type
            ];
            $params_string = '?metadata=true';
            foreach ($params as $key => $value) {
                if(!empty($value))
                    $params_string = $params_string.'&'.$key.'='.$value;
            }
            $ch = curl_init();
            curl_setopt($ch, CURLOPT_HTTPHEADER,["Authorization: Basic " . base64_encode(self::email.':'.self::token)]);
            curl_setopt($ch, CURLOPT_URL,self::url.$params_string);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            $response = json_decode(curl_exec($ch),true);
            curl_close($ch);
            $response['metadata']['currentPage'] = $page;
            $response['metadata']['amountPages'] = isset($response['total']) ? ceil($response['total'] / 10) : 0;
            return $response;
        } catch (Exception $e) {
            return false;
        }
        return false;
    }

    public function save()
    {
        try {
            $data = json_encode($this->constructData());
            $ch = curl_init();
            if (empty($this->id))
                curl_setopt($ch, CURLOPT_POST, 1);
            else
                curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "PUT");
            curl_setopt($ch, CURLOPT_HTTPHEADER,["Authorization: Basic " . base64_encode(self::email.':'.self::token)]);
            curl_setopt($ch, CURLOPT_URL,self::url);
            curl_setopt($ch, CURLOPT_POSTFIELDS,$data);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            $response = json_decode(curl_exec($ch),true);
            curl_close($ch);
            return $response;
        } catch (Exception $e) {
            return false;
        }
    }

    public function delete()
    {
        try {
            $ch = curl_init();
            curl_setopt($ch, CURLOPT_URL,self::url.$this->id);
            curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "DELETE");
            curl_setopt($ch, CURLOPT_HTTPHEADER,["Authorization: Basic " . base64_encode(self::email.':'.self::token)]);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            $response = json_decode(curl_exec($ch),true);
            curl_close($ch);
            return $response['code'] == 200;
        } catch (Exception $e) {
            return false;
        }
    }

    private function constructData()
    {
        return [
            "name" => $this->name,
            "identification" => $this->identification,
            "email" => $this->email,
            "phonePrimary" => $this->phonePrimary,
            "phoneSecondary" => $this->phoneSecondary,
            "fax" => $this->fax,
            "mobile" => $this->mobile,
            'ignoreRepeated' => false,
            "observations" => $this->observations,
            "address" => $this->address,
            "type" => $this->type,
            "seller" => null,
            "term" => null,
            "priceList" => null,
            "internalContacts" => []
        ];
    }
}