<?php

namespace Application\Models;

class Client 
{
    const url = 'https://app.alegra.com/api/v1/contacts/';
    const token = '';
    const email = '';

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

    public function search($page,$order_field,$order_direction,$query,$type = "provider")
    {
        try {
            $params = [
                'start' => ($page - 1) * 10,
                'limit' => 10,
                'order_field' => $order_field,
                'order_direction' => $order_direction,
                'query' => $query,
                'type' => $type
            ];
            $params_string = 'metadata=1';
            foreach ($params as $key => $value) {
                if(!empty($value))
                    $params_string = $params_string.'&'.$key.'='.$value;
            }
            $ch = curl_init();
            curl_setopt($ch, CURLOPT_HTTPHEADER,["Authorization: Basic " . base64_encode(self::email.':'.self::token)]);
            curl_setopt($ch, CURLOPT_URL,self::url_search);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            $response = curl_exec($ch);
            curl_close($ch);
            $response['metadata']['currentPage'] = $page;
            $response['metadata']['amountPages'] = ceil($response['total'] / 10);
            return $response;
        } catch (Exception $e) {
            return false;
        }
    }

    public function save()
    {
        try {
            $ch = curl_init();
            if (empty($this->id))
                curl_setopt($ch, CURLOPT_POST, 1);
            else            
                curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "PUT");
            curl_setopt($ch, CURLOPT_HTTPHEADER,["Authorization: Basic " . base64_encode(self::email.':'.self::token)]);
            curl_setopt($ch, CURLOPT_URL,self::url.$this->id);
            curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "PUT");
            curl_setopt($ch, CURLOPT_POSTFIELDS,http_build_query($this->serialize()));
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            $response = curl_exec($ch);
            curl_close($ch);

            $this->id = $response['id'];
        } catch (Exception $e) {
            return false;
        }
    }

    public function delete()
    {
        try {
            $ch = curl_init();
            curl_setopt($ch, CURLOPT_URL,self::url.$this->id);
            if($method==='POST')
                curl_setopt($ch, CURLOPT_POST, 1);
            else
                curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "DELETE");
            curl_setopt($ch, CURLOPT_HTTPHEADER,["Authorization: Basic " . base64_encode(self::email.':'.self::token)]);
            curl_setopt($ch, CURLOPT_POSTFIELDS,http_build_query($request));
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            $response = curl_exec($ch);
            curl_close($ch);
            return $response['code'] == 200;
        } catch (Exception $e) {
            return false;
        }
    }
}